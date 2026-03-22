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
  const { clearConversationUnread, setOpenConversationId } = useChatUnread();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(routeConversationId);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("sidebar");

  // ✅ No connect/disconnect here — ChatUnreadProvider owns the socket lifecycle

  // Tell the unread context which conversation is open so it skips incrementing
  useEffect(() => {
    setOpenConversationId(routeConversationId);
    return () => {
      setOpenConversationId(null);
    };
  }, [routeConversationId, setOpenConversationId]);

  // Clear badge when URL changes to a conversation
  useEffect(() => {
    setSelectedConversationId(routeConversationId);
    if (routeConversationId) {
      clearConversationUnread(routeConversationId);
    }
  }, [routeConversationId, clearConversationUnread]);

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

    const hasSelected = conversations.some(
      (c) => c.id === selectedConversationId,
    );
    if (!selectedConversationId || !hasSelected) {
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

  // Update sidebar lastMessage when new messages arrive
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const handleNewMessage = (message: ChatMessage) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === message.conversationId);

        if (idx === -1) {
          // New conversation — reload list
          loadConversations()
            .then((next) => {
              if (cancelled) return;
              setConversations(next);
            })
            .catch(console.error);
          return prev;
        }

        // Move to top with updated lastMessage
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          lastMessage: message.text || updated[idx].lastMessage,
        };
        const [moved] = updated.splice(idx, 1);
        updated.unshift(moved);
        return updated;
      });
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      cancelled = true;
      chatService.offNewMessage(handleNewMessage);
    };
  }, [user?.id, loadConversations]);

  // Redirect if routeConversationId doesn't exist in conversations
  useEffect(() => {
    if (!routeConversationId) return;
    if (!hasLoadedConversations || isConversationsLoading) return;

    const exists = conversations.some((c) => c.id === routeConversationId);
    if (!exists) router.replace("/chat");
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
    }
  }, [user, loading, router]);

  // Responsive panel handling
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setActivePanel("sidebar");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectConversation = (id: string) => {
    clearConversationUnread(id);
    setOpenConversationId(id);
    setSelectedConversationId(id);
    router.push(`/chat/${id}`);
    if (isMobile) setActivePanel("chat");
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
