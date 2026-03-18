"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMain from "@/components/chat/ChatMain";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/common/loading/loading";
import { usePetSitterDetail } from "@/hooks/pet-sitter-detail/usePetSitterDetail";

export type Conversation = {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  unread?: number;
};

type ActivePanel = "sidebar" | "chat";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sid = searchParams.get("sid");
  const { user, loading } = useAuth();
  const { sitter, isLoading: isSitterLoading } = usePetSitterDetail(sid ?? null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(sid);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("sidebar");

  const conversations: Conversation[] = useMemo(() => {
    if (!sid) return [];
    const name = sitter
      ? sitter.tradeName ?? sitter.sitter?.name ?? "Pet Sitter"
      : "Pet Sitter";
    const avatarUrl =
      sitter?.sitter?.profileImgUrl ?? "/avatars/avatar-1.png";
    return [{ id: sid, name, avatarUrl, lastMessage: "" }];
  }, [sitter, sid]);

  useEffect(() => {
    setSelectedConversationId(sid);
  }, [sid]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent("/chat")}`);
      return;
    }
    if (user.role !== "owner") {
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

    if (isMobile) {
      setActivePanel("chat");
    }
  };

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? null;

  const isAuthReady = !loading && user && user.role === "owner";
  const isSitterReady = !sid || !isSitterLoading;

  if (!isAuthReady || (sid && !isSitterReady)) {
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