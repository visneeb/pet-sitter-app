"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { chatApi } from "@/services/api/chatApi";
import chatService, {
  ChatMessage,
  MessageReadEvent,
} from "@/services/chatService";

type ChatUnreadContextValue = {
  unreadTotal: number;
  unreadByConversation: Record<string, number>;
  refreshUnreadCount: () => Promise<void>;
  incrementConversationUnread: (conversationId: string, amount?: number) => void;
  clearConversationUnread: (conversationId: string) => void;
  /** Call this when the user opens a conversation so we skip incrementing */
  setOpenConversationId: (id: string | null) => void;
};

const ChatUnreadContext = createContext<ChatUnreadContextValue | null>(null);

const canAccessChat = (role?: string) =>
  role === "owner" || role === "petsitter" || role === "sitter";

export function ChatUnreadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unreadByConversation, setUnreadByConversation] = useState<
    Record<string, number>
  >({});
  const isRefreshingRef = useRef(false);
  const shouldRefreshAgainRef = useRef(false);

  // Track which conversation is currently open so we don't increment its badge
  const openConversationIdRef = useRef<string | null>(null);

  const setOpenConversationId = useCallback((id: string | null) => {
    openConversationIdRef.current = id;
  }, []);

  const applyUnreadMap = useCallback((nextMap: Record<string, number>) => {
    setUnreadByConversation(nextMap);
    const total = Object.values(nextMap).reduce((sum, count) => sum + count, 0);
    setUnreadTotal(total);
  }, []);

  const incrementConversationUnread = useCallback(
    (conversationId: string, amount = 1) => {
      if (!conversationId || amount <= 0) return;

      setUnreadByConversation((prev) => {
        const current = prev[conversationId] ?? 0;
        const next = { ...prev, [conversationId]: current + amount };
        setUnreadTotal(
          Object.values(next).reduce((sum, count) => sum + count, 0),
        );
        return next;
      });
    },
    [],
  );

  const clearConversationUnread = useCallback((conversationId: string) => {
    if (!conversationId) return;

    setUnreadByConversation((prev) => {
      if ((prev[conversationId] ?? 0) === 0) return prev;
      const next = { ...prev, [conversationId]: 0 };
      setUnreadTotal(
        Object.values(next).reduce((sum, count) => sum + count, 0),
      );
      return next;
    });
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!user?.id || !canAccessChat(user.role)) {
      applyUnreadMap({});
      return;
    }

    if (isRefreshingRef.current) {
      shouldRefreshAgainRef.current = true;
      return;
    }

    isRefreshingRef.current = true;
    try {
      const data = await chatApi.getConversations();
      const conversations = data.conversations ?? [];
      const nextMap = conversations.reduce<Record<string, number>>(
        (acc, conversation) => {
          acc[conversation.conversationId] = conversation.unreadCount ?? 0;
          return acc;
        },
        {},
      );

      applyUnreadMap(nextMap);

      // ✅ ChatUnreadProvider is the single owner of connect + joinConversation
      chatService.connect();
      conversations.forEach((c) => {
        chatService.joinConversation(c.conversationId);
      });
    } catch (error) {
      console.error("Failed to refresh unread count:", error);
    } finally {
      isRefreshingRef.current = false;
      if (shouldRefreshAgainRef.current) {
        shouldRefreshAgainRef.current = false;
        void refreshUnreadCount();
      }
    }
  }, [applyUnreadMap, user?.id, user?.role]);

  useEffect(() => {
    if (loading) return;
    if (!user?.id || !canAccessChat(user.role)) {
      applyUnreadMap({});
      return;
    }

    chatService.connect();
    void refreshUnreadCount();

    const handleNewMessage = (message: ChatMessage) => {
      // Don't increment if it's our own message
      if (message.senderId === user.id) return;

      // ✅ Don't increment if the user is currently in that conversation
      if (openConversationIdRef.current === message.conversationId) return;

      incrementConversationUnread(message.conversationId);
    };

    const handleMessageRead = (payload: MessageReadEvent) => {
      if (payload.userId !== user.id) return;
      clearConversationUnread(payload.conversationId);
    };

    const handleWindowFocus = () => void refreshUnreadCount();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshUnreadCount();
    };

    chatService.onNewMessage(handleNewMessage);
    chatService.onMessageRead(handleMessageRead);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      chatService.offNewMessage(handleNewMessage);
      chatService.offMessageRead(handleMessageRead);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    loading,
    user?.id,
    user?.role,
    refreshUnreadCount,
    applyUnreadMap,
    incrementConversationUnread,
    clearConversationUnread,
  ]);

  const value = useMemo(
    () => ({
      unreadTotal,
      unreadByConversation,
      refreshUnreadCount,
      incrementConversationUnread,
      clearConversationUnread,
      setOpenConversationId,
    }),
    [
      unreadTotal,
      unreadByConversation,
      refreshUnreadCount,
      incrementConversationUnread,
      clearConversationUnread,
      setOpenConversationId,
    ],
  );

  return (
    <ChatUnreadContext.Provider value={value}>
      {children}
    </ChatUnreadContext.Provider>
  );
}

export function useChatUnread() {
  const context = useContext(ChatUnreadContext);
  if (!context) {
    throw new Error("useChatUnread must be used within ChatUnreadProvider");
  }
  return context;
}
