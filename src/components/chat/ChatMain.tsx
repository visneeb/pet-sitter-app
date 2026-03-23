import Image from "next/image";
import MessageInput from "./MessageInput";
import { CloseIcon } from "@/assets/icons/components";
import type { Conversation } from "@/components/chat/ChatPageContent";
import { Paw } from "@/decorations/Paw";
import MessageList from "./MessageList";
import Loading from "@/components/common/loading/loading";
import { useChat } from "@/hooks/chat/useChat";
import { useAuth } from "@/contexts/AuthContext";
type ChatMainProps = {
  conversation: Conversation | null;
  onClose?: () => void;
};

export default function ChatMain({ conversation, onClose }: ChatMainProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const { messages, sendMessage, isLoading, isOtherTyping, startTyping, stopTyping } =
    useChat({
    conversationId: conversation?.id ?? null,
    currentUserId,
    });
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex h-24 items-center justify-between bg-gray-100 px-10 py-6">
        {conversation ? (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
              {conversation.avatarUrl ? (
                <Image
                  src={conversation.avatarUrl}
                  alt={conversation.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                  {conversation.name.slice(0, 1).toUpperCase()}
                </div>
              )}
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
            className="cursor-pointer text-lg text-gray-400 transition hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {conversation ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden py-2 px-2">
            {isLoading ? (
              <Loading className="min-h-[200px]" />
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                isOtherTyping={isOtherTyping}
                typingDisplayName={conversation.name}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20  rounded-full bg-pink-100 text-3xl">
              <Paw className="text-pink-500" />
            </div>
            <p className="style-body-1 text-gray-300">Start a conversation!</p>
          </div>
          </div>
        )}
      </div>

      <MessageInput
        onSend={sendMessage}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </section>
  );
}