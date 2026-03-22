import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/hooks/chat/useChat";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string | null;
};

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // เลื่อนไปที่ข้อความล่าสุดทุกครั้งที่ messages เปลี่ยน
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-2 pb-2">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          text={message.text}
          isMe={message.senderId === currentUserId ? "me" : "other"}
        />
      ))}
      {/* Element เพื่อ scroll มาหา */}
      <div ref={bottomRef} />
    </div>
  );
}