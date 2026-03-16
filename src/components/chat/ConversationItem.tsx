import Image from "next/image";
import type { Conversation } from "@/app/chat/page";

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
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
        isActive ? "bg-white/15" : "hover:bg-white/10"
      }`}
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-300">
        <Image
          src={conversation.avatarUrl}
          alt={conversation.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{conversation.name}</p>
        <p className="truncate text-xs text-white/60">
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unread ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
          {conversation.unread}
        </span>
      ) : null}
    </button>
  );
}