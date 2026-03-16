"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMain from "@/components/chat/ChatMain";

export type Conversation = {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  unread?: number;
};

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Mek MapMaster",
    avatarUrl: "/avatars/avatar-1.png",
    lastMessage: "Hello",
  },
  {
    id: 2,
    name: "Junior Mon san",
    avatarUrl: "/avatars/avatar-2.png",
    lastMessage: "You there?",
  },
  {
    id: 3,
    name: "Senior Matang",
    avatarUrl: "/avatars/avatar-3.png",
    lastMessage: "I love your cat",
    unread: 1,
  },
  {
    id: 4,
    name: "Meena Inw FE",
    avatarUrl: "/avatars/avatar-4.png",
    lastMessage: "good morning",
  },
  {
    id: 5,
    name: "Bank TechLead",
    avatarUrl: "/avatars/avatar-5.png",
    lastMessage: "I am here",
    unread: 2,
  },
  {
    id: 6,
    name: "Tew The Legend",
    avatarUrl: "/avatars/avatar-5.png",
    lastMessage: "Wow",
    unread: 2,
  },
];

type ActivePanel = "sidebar" | "chat";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(1);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("sidebar");

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

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);

    if (isMobile) {
      setActivePanel("chat");
    }
  };

  const selectedConversation =
    mockConversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? null;

  return (
    <main className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <section className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden bg-white">
        <ChatSidebar
          conversations={mockConversations}
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