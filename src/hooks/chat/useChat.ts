import chatService from "@/services/chatService";
import { useState, useEffect } from "react";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: number;
  text: string;
  createdAt: string;
};

type UseChatParams = {
  /** รองรับทั้ง number (จาก Conversation.id) และ string */
  conversationId: string | number | null;
  currentUserId: number | null;
};

export function useChat({ conversationId, currentUserId }: UseChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const conversationIdStr = conversationId != null ? String(conversationId) : null;

  useEffect(() => {
    const socket = chatService.connect();
    if (!socket) return;
    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!conversationIdStr) return;

    setMessages([]);
    chatService.joinConversation(conversationIdStr);

    const handleNewMessage = (message: ChatMessage) => {
      if (String(message.conversationId) !== conversationIdStr) return;
      setMessages((prev) => [...prev, message]);
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      chatService.offNewMessage(handleNewMessage);
      chatService.leaveConversation(conversationIdStr);
    };
  }, [conversationIdStr]);

  const sendMessage = (text: string) => {
    if (!conversationIdStr) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    chatService.sendMessage({
      conversationId: conversationIdStr,
      senderId: currentUserId ?? 0,
      text: trimmed,
    });
  };

  return {
    messages,
    sendMessage,
  };
}
