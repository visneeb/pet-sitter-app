import chatService from "@/services/chatService";
import { chatApi } from "@/services/api/chatApi";
import { useState, useEffect, useRef } from "react";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type UseChatParams = {
  conversationId: string | number | null;
  currentUserId?: string | null;
};

export function useChat({ conversationId, currentUserId }: UseChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const conversationIdStr =
    conversationId != null ? String(conversationId) : null;
  const typingTimeoutRef = useRef<number | null>(null);

  // ✅ No connect/disconnect here — ChatUnreadProvider owns the socket lifecycle

  useEffect(() => {
    if (!conversationIdStr) {
      setIsLoading(false);
      setIsOtherTyping(false);
      return;
    }

    let cancelled = false;

    // Join this specific room (chatService.joinConversation is idempotent)
    chatService.joinConversation(conversationIdStr);

    // Fetch message history
    setMessages([]);
    setIsLoading(true);
    chatApi
      .getConversationMessages(conversationIdStr)
      .then((data) => {
        if (cancelled) return;
        const initialMessages = (data.messages ?? []).map((msg) => ({
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          text: msg.text,
          createdAt: msg.createdAt,
        }));
        setMessages(initialMessages);
        setIsLoading(false);

        // Mark latest message as read if it's from someone else
        const latest = initialMessages[initialMessages.length - 1];
        if (latest && latest.senderId !== currentUserId) {
          chatService.markAsRead(conversationIdStr, latest.id);
        }
      })
      .catch((error) => {
        console.error("Failed to load conversation messages:", error);
        if (!cancelled) setIsLoading(false);
      });

    // Listen for incoming messages in this room
    const handleNewMessage = (message: ChatMessage) => {
      if (String(message.conversationId) !== conversationIdStr) return;

      setMessages((prev) => {
        // Deduplicate
        if (prev.some((m) => m.id === message.id)) return prev;

        // Mark as read immediately since user is looking at this conversation
        if (message.senderId !== currentUserId) {
          chatService.markAsRead(conversationIdStr, message.id);
        }

        return [...prev, message];
      });
    };

    const clearTypingTimeout = () => {
      if (typingTimeoutRef.current == null) return;
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    };

    const scheduleTypingTimeout = () => {
      clearTypingTimeout();
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsOtherTyping(false);
      }, 5000);
    };

    const handleTypingStart = (payload: {
      conversationId: string;
      userId: string;
    }) => {
      if (payload.conversationId !== conversationIdStr) return;
      if (payload.userId === currentUserId) return;
      setIsOtherTyping(true);
      scheduleTypingTimeout();
    };

    const handleTypingStop = (payload: { conversationId: string; userId: string }) => {
      if (payload.conversationId !== conversationIdStr) return;
      if (payload.userId === currentUserId) return;
      setIsOtherTyping(false);
      clearTypingTimeout();
    };

    chatService.onNewMessage(handleNewMessage);
    chatService.onTypingStart(handleTypingStart);
    chatService.onTypingStop(handleTypingStop);

    return () => {
      cancelled = true;
      chatService.offNewMessage(handleNewMessage);
      chatService.offTypingStart(handleTypingStart);
      chatService.offTypingStop(handleTypingStop);
      clearTypingTimeout();
      setIsOtherTyping(false);
      // ✅ Do NOT leaveConversation here — ChatUnreadProvider needs to stay
      //    joined to receive unread counts for all conversations
    };
  }, [conversationIdStr, currentUserId]);

  const sendMessage = (text: string) => {
    if (!conversationIdStr) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    chatService.sendMessage({ conversationId: conversationIdStr, text: trimmed });
  };

  const startTyping = () => {
    if (!conversationIdStr) return;
    chatService.startTyping(conversationIdStr);
  };

  const stopTyping = () => {
    if (!conversationIdStr) return;
    chatService.stopTyping(conversationIdStr);
  };

  return { messages, sendMessage, isLoading, isOtherTyping, startTyping, stopTyping };
}
