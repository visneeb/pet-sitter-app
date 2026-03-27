"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMain from "@/components/chat/ChatMain";
import { useAuth } from "@/contexts/AuthContext";
import ChatPageSkeleton from "@/components/chat/ChatPageSkeleton";
import { chatApi } from "@/services/api/chatApi";
import chatService, { ChatMessage } from "@/services/chatService";
import { useChatUnread } from "@/contexts/ChatUnreadContext";

export type Conversation = {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
};

type ChatPageContentProps = {
  routeConversationId: string | null;
};

const canAccessChat = (role?: string) =>
  role === "owner" || role === "petsitter" || role === "sitter";
const CONVERSATION_CACHE_TTL_MS = 30_000;

let conversationsCache: {
  userId: string | null;
  conversations: Conversation[] | null;
  loadedAt: number;
} = {
  userId: null,
  conversations: null,
  loadedAt: 0,
};

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

  // Tell unread context which conversation is open so it skips incrementing
  useEffect(() => {
    setOpenConversationId(routeConversationId);
    return () => {
      setOpenConversationId(null);
    };
  }, [routeConversationId, setOpenConversationId]);

  // Sync selected conversation with route + clear unread
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

  const shouldUseCachedConversations = useCallback(() => {
    if (!conversationsCache.conversations) return false;
    if (!user?.id || conversationsCache.userId !== user.id) return false;
    const age = Date.now() - conversationsCache.loadedAt;
    return age < CONVERSATION_CACHE_TTL_MS;
  }, [user?.id]);

  // Auto-select first conversation only on desktop when no route param
  useEffect(() => {
    if (isMobile) return;
    if (routeConversationId) return;
    if (!conversations.length) return;

    const hasSelected = conversations.some(
      (c) => c.id === selectedConversationId,
    );

    if (!selectedConversationId || !hasSelected) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [isMobile, routeConversationId, conversations, selectedConversationId]);

  // Load conversations on mount
  useEffect(() => {
    if (loading || !user) return;
    if (!canAccessChat(user.role)) return;

    if (shouldUseCachedConversations()) {
      setConversations(conversationsCache.conversations ?? []);
      setIsConversationsLoading(false);
      setHasLoadedConversations(true);
      return;
    }

    let cancelled = false;
    setIsConversationsLoading(true);
    setHasLoadedConversations(false);

    loadConversations()
      .then((next) => {
        if (cancelled) return;
        conversationsCache = {
          userId: user.id,
          conversations: next,
          loadedAt: Date.now(),
        };
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
  }, [loading, user, loadConversations, shouldUseCachedConversations]);

  // Update sidebar lastMessage when new messages arrive
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const handleNewMessage = (message: ChatMessage) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === message.conversationId);

        if (idx === -1) {
          loadConversations()
            .then((next) => {
              if (cancelled) return;
              conversationsCache = {
                userId: user.id,
                conversations: next,
                loadedAt: Date.now(),
              };
              setConversations(next);
            })
            .catch(console.error);
          return prev;
        }

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

  // Guard invalid conversation route; refresh once before redirecting.
  useEffect(() => {
    if (!routeConversationId) return;
    if (!hasLoadedConversations || isConversationsLoading) return;

    const exists = conversations.some((c) => c.id === routeConversationId);
    if (exists) return;

    let cancelled = false;
    setIsConversationsLoading(true);
    loadConversations()
      .then((next) => {
        if (cancelled) return;
        conversationsCache = {
          userId: conversationsCache.userId,
          conversations: next,
          loadedAt: Date.now(),
        };
        setConversations(next);
        const nowExists = next.some((c) => c.id === routeConversationId);
        if (!nowExists) {
          router.replace("/chat");
        }
      })
      .catch((error) => {
        console.error("Failed to refresh conversations for route:", error);
        if (!cancelled) router.replace("/chat");
      })
      .finally(() => {
        if (!cancelled) setIsConversationsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    routeConversationId,
    hasLoadedConversations,
    isConversationsLoading,
    conversations,
    router,
    loadConversations,
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

  // Responsive detection only
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 768);
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
    return <ChatPageSkeleton />;
  }

  return (
    <main className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <section className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden bg-white">
        {isMobile ? (
          routeConversationId ? (
            <ChatMain
              conversation={selectedConversation}
              onClose={() => router.push("/chat")}
            />
          ) : (
            <ChatSidebar
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              isFullWidth
            />
          )
        ) : (
          <>
            <ChatSidebar
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              isFullWidth={false}
            />
            <ChatMain conversation={selectedConversation} />
          </>
        )}
      </section>
    </main>
  );
}