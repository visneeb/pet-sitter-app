"use client";

import { useParams } from "next/navigation";
import ChatPageContent from "@/components/chat/ChatPageContent";

export default function ConversationChatPage() {
  const params = useParams<{ conversationid: string }>();
  const conversationId = params.conversationid;

  return <ChatPageContent routeConversationId={conversationId ?? null} />;
}
