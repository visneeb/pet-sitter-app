import Image from "next/image";
import type { Conversation } from "@/components/chat/ChatPageContent";

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
};

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center hover:cursor-pointer gap-3 px-4 py-3 text-left transition ${
        isActive ? "bg-white/15" : "hover:bg-white/10"
      }`}
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-300">
        {conversation.avatarUrl ? (
          <Image
            src={conversation.avatarUrl}
            alt={conversation.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
            {conversation.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{conversation.name}</p>
        <p className="truncate text-xs text-white/60">
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
}