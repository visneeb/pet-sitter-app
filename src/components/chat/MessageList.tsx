import { useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/hooks/chat/useChat";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string | null;
  isOtherTyping?: boolean;
  typingDisplayName?: string | null;
  hasMoreOlder?: boolean;
  isLoadingOlder?: boolean;
  onReachTop?: () => Promise<void> | void;
  onImageLoadError?: (messageId: string) => void;
  otherAvatarUrl?: string | null;
  otherDisplayName?: string | null;
};

export default function MessageList({
  messages,
  currentUserId,
  isOtherTyping = false,
  typingDisplayName,
  hasMoreOlder = false,
  isLoadingOlder = false,
  onReachTop,
  onImageLoadError,
  otherAvatarUrl,
  otherDisplayName,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingOlderRef = useRef(false);
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isLoadingOlderRef.current) {
      isLoadingOlderRef.current = false;
      return;
    }
    // เลื่อนไปที่ข้อความล่าสุดเมื่อมีข้อความใหม่
    scrollToBottom();
  }, [messages, isOtherTyping, scrollToBottom]);

  const handleScroll = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!onReachTop || isLoadingOlder || !hasMoreOlder) return;
    if (container.scrollTop > 40) return;

    const previousHeight = container.scrollHeight;
    isLoadingOlderRef.current = true;
    await onReachTop();
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      containerRef.current.scrollTop = containerRef.current.scrollHeight - previousHeight;
    });
  }, [hasMoreOlder, isLoadingOlder, onReachTop]);

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        void handleScroll();
      }}
      className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-2 pb-2"
    >
      {isLoadingOlder ? (
        <div className="flex justify-center py-2 text-xs text-gray-500">Loading older messages...</div>
      ) : null}
      {messages.map((message) => (
        <MessageBubble
          id={message.id}
          key={message.id}
          text={message.text}
          messageType={message.messageType}
          imageUrl={message.imageUrl}
          isMe={message.senderId === currentUserId ? "me" : "other"}
          onImageLoadError={onImageLoadError}
          onImageLoad={scrollToBottom}
          otherAvatarUrl={otherAvatarUrl}
          otherDisplayName={otherDisplayName}
        />
      ))}
      {isOtherTyping ? (
        <div className="w-fit max-w-[80%] rounded-[20px] bg-gray-100 px-4 py-2 text-sm text-gray-500">
          <span className="loading loading-dots loading-sm"></span>
          {(typingDisplayName?.trim() || "Someone") + " is typing..."}
        </div>
      ) : null}
      {/* Element เพื่อ scroll มาหา */}
      <div ref={bottomRef} />
    </div>
  );
}