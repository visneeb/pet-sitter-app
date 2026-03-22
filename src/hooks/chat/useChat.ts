import chatService from "@/services/chatService";
import { chatApi } from "@/services/api/chatApi";
import { useState, useEffect } from "react";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type UseChatParams = {
  /** รองรับทั้ง number (จาก Conversation.id) และ string */
  conversationId: string | number | null;
  currentUserId?: string | null;
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

    let cancelled = false;

    chatService.connect();
    const socket = chatService.getSocket();
    if (!socket) return;

    const syncJoin = () => {
      chatService.joinConversation(conversationIdStr);
    };

    setMessages([]);
    syncJoin();
    socket.on("connect", syncJoin);

    chatApi
      .getConversationMessages(conversationIdStr)
      .then((data) => {
        if (cancelled) return;
        const initialMessages = (data.messages ?? []).map((message) => ({
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          text: message.text,
          createdAt: message.createdAt,
        }));
        setMessages(initialMessages);
        const latestMessage = initialMessages[initialMessages.length - 1];
        if (
          latestMessage &&
          latestMessage.senderId !== currentUserId &&
          conversationIdStr
        ) {
          chatService.markAsRead(conversationIdStr, latestMessage.id);
        }
      })
      .catch((error) => {
        console.error("Failed to load conversation messages:", error);
      });

    const handleNewMessage = (message: ChatMessage) => {
      if (String(message.conversationId) !== conversationIdStr) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        if (
          message.senderId !== currentUserId &&
          message.conversationId === conversationIdStr
        ) {
          chatService.markAsRead(conversationIdStr, message.id);
        }
        return [...prev, message];
      });
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      cancelled = true;
      socket.off("connect", syncJoin);
      chatService.offNewMessage(handleNewMessage);
    };
  }, [conversationIdStr, currentUserId]);

  const sendMessage = (text: string) => {
    if (!conversationIdStr) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    chatService.sendMessage({
      conversationId: conversationIdStr,
      text: trimmed,
    });
  };

  return {
    messages,
    sendMessage,
  };
}
