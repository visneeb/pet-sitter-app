"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMain from "@/components/chat/ChatMain";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/common/loading/loading";
import { chatApi } from "@/services/api/chatApi";
import chatService, { ChatMessage } from "@/services/chatService";
import { useChatUnread } from "@/contexts/ChatUnreadContext";

export type Conversation = {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
};

type ActivePanel = "sidebar" | "chat";

type ChatPageContentProps = {
  routeConversationId: string | null;
};

const canAccessChat = (role?: string) =>
  role === "owner" || role === "petsitter" || role === "sitter";

export default function ChatPageContent({
  routeConversationId,
}: ChatPageContentProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { clearConversationUnread } = useChatUnread();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(routeConversationId);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("sidebar");

  // ✅ Single connect on mount, disconnect on unmount
  useEffect(() => {
    chatService.connect();
    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    setSelectedConversationId(routeConversationId);
  }, [routeConversationId]);

  const loadConversations = useCallback(async () => {
    const data = await chatApi.getConversations();
    return (data.conversations ?? []).map((item) => ({
      id: item.conversationId,
      name: item.name,
      avatarUrl: item.avatarUrl,
      lastMessage: item.lastMessage,
    }));
  }, []);

  // Auto-select first conversation when no route param
  useEffect(() => {
    if (routeConversationId) return;
    if (!conversations.length) return;

    const hasSelectedConversation = conversations.some(
      (conversation) => conversation.id === selectedConversationId,
    );

    if (!selectedConversationId || !hasSelectedConversation) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [routeConversationId, conversations, selectedConversationId]);

  // Load conversations on mount
  useEffect(() => {
    if (loading || !user) return;
    if (!canAccessChat(user.role)) return;

    let cancelled = false;
    setIsConversationsLoading(true);
    setHasLoadedConversations(false);

    loadConversations()
      .then((next) => {
        if (cancelled) return;
        setConversations(next);
      })
      .catch((error) => {
        console.error("Failed to load conversations:", error);
        if (cancelled) return;
        setConversations([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsConversationsLoading(false);
        setHasLoadedConversations(true);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, user, loadConversations]);

  // ✅ Join all conversation rooms after conversations load
  // whenConnected() in chatService handles timing — no race condition
  useEffect(() => {
    if (!conversations.length) return;
    conversations.forEach((conversation) => {
      chatService.joinConversation(conversation.id);
    });
  }, [conversations]);

  // ✅ Register new-message listener once per user — no connect() call here
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const handleNewMessage = (message: ChatMessage) => {
      const activeConversationId = routeConversationId ?? selectedConversationId;
      const isActiveConversation = activeConversationId === message.conversationId;

      setConversations((prev) => {
        const idx = prev.findIndex(
          (conversation) => conversation.id === message.conversationId,
        );

        // Conversation not in list — reload all
        if (idx === -1) {
          loadConversations()
            .then((next) => {
              if (cancelled) return;
              setConversations(next);
            })
            .catch((error) => {
              console.error(
                "Failed to refresh conversations for new room:",
                error,
              );
            });
          return prev;
        }

        // Move conversation to top with updated lastMessage
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          lastMessage: message.text || updated[idx].lastMessage,
        };
        const [moved] = updated.splice(idx, 1);
        updated.unshift(moved);
        return updated;
      });

      if (isActiveConversation) {
        clearConversationUnread(message.conversationId);
      }
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      cancelled = true;
      chatService.offNewMessage(handleNewMessage);
    };
  }, [user?.id, routeConversationId, selectedConversationId, loadConversations, clearConversationUnread]);
  // ✅ Removed routeConversationId & selectedConversationId from deps —
  //    they caused the listener to re-register on every navigation

  // Redirect if routeConversationId doesn't exist in conversations
  useEffect(() => {
    if (!routeConversationId) return;
    if (!hasLoadedConversations || isConversationsLoading) return;

    const exists = conversations.some((c) => c.id === routeConversationId);
    if (!exists) {
      router.replace("/chat");
    }
  }, [
    routeConversationId,
    hasLoadedConversations,
    isConversationsLoading,
    conversations,
    router,
  ]);

  // Auth guard
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent("/chat")}`);
      return;
    }
    if (!canAccessChat(user.role)) {
      router.replace("/");
      return;
    }
  }, [user, loading, router]);

  // Responsive panel handling
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;

      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);

      if (!isNowMobile) {
        setActivePanel("sidebar");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelectConversation = (id: string) => {
    clearConversationUnread(id);
    setSelectedConversationId(id);
    router.push(`/chat/${id}`);

    if (isMobile) {
      setActivePanel("chat");
    }
  };

  const selectedConversation = useMemo(() => {
    if (!conversations.length) return null;
    if (routeConversationId) {
      const fromRoute = conversations.find(
        (c) => String(c.id) === String(routeConversationId),
      );
      if (fromRoute) return fromRoute;
    }
    if (selectedConversationId != null) {
      return (
        conversations.find(
          (c) => String(c.id) === String(selectedConversationId),
        ) ?? null
      );
    }
    return null;
  }, [conversations, routeConversationId, selectedConversationId]);

  const isAuthReady = !loading && !!user && canAccessChat(user.role);

  if (!isAuthReady || isConversationsLoading) {
    return <Loading />;
  }

  return (
    <main className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <section className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden bg-white">
        <ChatSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          isFullWidth={isMobile && activePanel === "sidebar"}
        />

        {isMobile ? (
          <div
            className={`absolute inset-0 z-10 flex transform bg-white transition-transform duration-300 ease-out ${
              activePanel === "chat" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <ChatMain
              conversation={selectedConversation}
              onClose={() => setActivePanel("sidebar")}
            />
          </div>
        ) : (
          <ChatMain conversation={selectedConversation} />
        )}
      </section>
    </main>
  );
}