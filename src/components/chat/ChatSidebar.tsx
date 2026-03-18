import ConversationItem from "./ConversationItem";
import type { Conversation } from "@/app/chat/page";

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isFullWidth?: boolean;
};

export default function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isFullWidth = false,
}: ChatSidebarProps) {
  return (
    <aside
      className={`flex min-h-0 shrink-0 flex-col overflow-hidden border-r bg-black text-white ${
        isFullWidth ? "w-full" : "w-[300px]"
      }`}
    >
      <div className="shrink-0 border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </aside>
  );
}