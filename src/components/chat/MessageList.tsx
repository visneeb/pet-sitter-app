import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/hooks/chat/useChat";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string | null;
  isOtherTyping?: boolean;
  typingDisplayName?: string | null;
  onImageLoadError?: (messageId: string) => void;
};

export default function MessageList({
  messages,
  currentUserId,
  isOtherTyping = false,
  typingDisplayName,
  onImageLoadError,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // เลื่อนไปที่ข้อความล่าสุดทุกครั้งที่ messages เปลี่ยน
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-2 pb-2">
      {messages.map((message) => (
        <MessageBubble
          id={message.id}
          key={message.id}
          text={message.text}
          messageType={message.messageType}
          imageUrl={message.imageUrl}
          isMe={message.senderId === currentUserId ? "me" : "other"}
          onImageLoadError={onImageLoadError}
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