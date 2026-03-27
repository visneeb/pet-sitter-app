import Image from "next/image";
import type { Conversation } from "@/components/chat/ChatPageContent";
import { useChatUnread } from "@/contexts/ChatUnreadContext";

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
  const { unreadByConversation } = useChatUnread();
  const unreadCount = unreadByConversation[conversation.id] ?? 0;
  const shouldShowUnreadBadge = !isActive && unreadCount > 0;

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
            sizes="40px"
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
          {conversation.lastMessage || "Start a conversation"}
        </p>
      </div>

      {shouldShowUnreadBadge ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </button>
  );
}
