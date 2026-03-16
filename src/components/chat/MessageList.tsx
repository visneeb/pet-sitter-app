import MessageBubble from "./MessageBubble";

type Message = {
  id: number;
  text: string;
  isMe: boolean;
};

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-2 pb-2">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          text={message.text}
          isMe={message.isMe}
        />
      ))}
    </div>
  );
}