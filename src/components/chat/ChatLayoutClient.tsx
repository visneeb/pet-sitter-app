"use client";

import { useParams } from "next/navigation";
import ChatPageContent from "@/components/chat/ChatPageContent";

type ChatRouteParams = {
  conversationid?: string;
};

export default function ChatLayoutClient() {
  const params = useParams<ChatRouteParams>();
  const conversationId = params?.conversationid ?? null;

  return <ChatPageContent routeConversationId={conversationId} />;
}

