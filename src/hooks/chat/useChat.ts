import chatService from "@/services/chatService";
import { chatApi } from "@/services/api/chatApi";
import { useState, useEffect, useRef, useCallback } from "react";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  messageType: "text" | "image";
  imageUrl: string | null;
  createdAt: string;
};

type UseChatParams = {
  conversationId: string | number | null;
  currentUserId?: string | null;
};

export function useChat({ conversationId, currentUserId }: UseChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const conversationIdStr =
    conversationId != null ? String(conversationId) : null;
  const typingTimeoutRef = useRef<number | null>(null);
  const imageRetryRef = useRef<Record<string, number>>({});

  const fetchMessages = useCallback(async () => {
    if (!conversationIdStr) return [];

    const data = await chatApi.getConversationMessages(conversationIdStr);
    return (data.messages ?? []).map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      text: msg.text,
      messageType: msg.messageType,
      imageUrl: msg.imageUrl,
      createdAt: msg.createdAt,
    }));
  }, [conversationIdStr]);

  // ✅ No connect/disconnect here — ChatUnreadProvider owns the socket lifecycle

  useEffect(() => {
    if (!conversationIdStr) {
      setIsLoading(false);
      setIsOtherTyping(false);
      imageRetryRef.current = {};
      return;
    }

    let cancelled = false;

    // Join this specific room (chatService.joinConversation is idempotent)
    chatService.joinConversation(conversationIdStr);

    // Fetch message history
    setMessages([]);
    setIsLoading(true);
    fetchMessages()
      .then((initialMessages) => {
        if (cancelled) return;
        setMessages(initialMessages);
        setIsLoading(false);

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
  }, [conversationIdStr, currentUserId, fetchMessages]);

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

  const sendImage = async (image: File) => {
    if (!conversationIdStr) return;
    setIsUploadingImage(true);
    try {
      const data = await chatApi.uploadConversationImage(conversationIdStr, image);
      const uploadedMessage = data.message;

      setMessages((prev) => {
        if (prev.some((m) => m.id === uploadedMessage.id)) return prev;
        return [...prev, uploadedMessage];
      });
    } catch (error) {
      console.error("Failed to upload chat image:", error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const retryImageUrlForMessage = async (messageId: string) => {
    const currentRetryCount = imageRetryRef.current[messageId] ?? 0;
    if (currentRetryCount >= 1) return;
    imageRetryRef.current[messageId] = currentRetryCount + 1;

    try {
      const refreshedMessages = await fetchMessages();
      setMessages(refreshedMessages);
    } catch (error) {
      console.error("Failed to refresh chat image URLs:", error);
    }
  };

  return {
    messages,
    sendMessage,
    sendImage,
    isLoading,
    isUploadingImage,
    isOtherTyping,
    startTyping,
    stopTyping,
    retryImageUrlForMessage,
  };
}
