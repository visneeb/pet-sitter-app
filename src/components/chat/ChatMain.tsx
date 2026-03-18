import Image from "next/image";
import MessageInput from "./MessageInput";
import { CloseIcon } from "@/assets/icons/components";
import type { Conversation } from "@/app/chat/page";
import { Paw } from "@/decorations/Paw";
import MessageList from "./MessageList";
import { useChat } from  "@/hooks/chat/useChat";
type ChatMainProps = {
  conversation: Conversation | null;
  onClose?: () => void;
};

export default function ChatMain({ conversation, onClose }: ChatMainProps) {
  const currentUserId = 1;
  const { messages, sendMessage } = useChat({ conversationId: conversation?.id ?? null, currentUserId });
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex h-24 items-center justify-between bg-gray-100 px-10 py-6">
        {conversation ? (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
              <Image
                src={conversation.avatarUrl}
                alt={conversation.name}
                fill
                className="object-cover"
              />
            </div>

            <p className="style-headline-3">{conversation.name}</p>
          </div>
        ) : (
          <p className="text-sm font-semibold text-gray-900">Chat</p>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-lg text-gray-400 transition hover:text-gray-600 md:hidden"
          >
            <CloseIcon />
          </button>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2">
        {conversation ? (
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-3xl">
              <Paw className="text-pink-500" />
            </div>
            <p className="style-body-1 text-gray-300">Start a conversation!</p>
          </div>
        )}
      </div>

      <MessageInput onSend={sendMessage} />
    </section>
  );
}