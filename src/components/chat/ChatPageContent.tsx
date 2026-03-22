"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMain from "@/components/chat/ChatMain";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/common/loading/loading";
import { chatApi } from "@/services/api/chatApi";
import chatService, { ChatMessage } from "@/services/chatService";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(routeConversationId);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("sidebar");

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

  useEffect(() => {
    if (!conversations.length) return;
    chatService.connect();
    conversations.forEach((conversation) => {
      chatService.joinConversation(conversation.id);
    });
  }, [conversations]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = chatService.connect();
    if (!socket) return;
    let cancelled = false;

    const handleNewMessage = (message: ChatMessage) => {
      setConversations((prev) => {
        const idx = prev.findIndex(
          (conversation) => conversation.id === message.conversationId,
        );
        if (idx === -1) {
          loadConversations()
            .then((next) => {
              if (cancelled) return;
              setConversations(next);
            })
            .catch((error) => {
              console.error("Failed to refresh conversations for new room:", error);
            });
          return prev;
        }

        const updated = [...prev];
        const current = updated[idx];

        updated[idx] = {
          ...current,
          lastMessage: message.text || current.lastMessage,
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
  }, [
    user?.id,
    routeConversationId,
    selectedConversationId,
    loadConversations,
  ]);

  useEffect(() => {
    if (!routeConversationId) {
      return;
    }
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

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;

      const isNowMobile = window.innerWidth < 768; // Tailwind md breakpoint
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
