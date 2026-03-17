import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { ActionButton } from "../ui/Button";
import { Input } from "../ui/input/Input";
import type useChatbot from "@/hooks/chatbot/useChatbot";
import Link from "next/link";
import Loading from "../common/loading/loading";

interface Props {
  chatbot: ReturnType<typeof useChatbot>;
}

function ChatbotContainer({ chatbot }: Props) {
  const {
    inputValue,
    userMessages,
    botMessages,
    chatScrollRef,
    handleOnChange,
    handleNavigate,
    isLoading,
  } = chatbot;
  const isSubmitDisabled = inputValue.trim().length < 10 || chatbot.isLoading;

  const chatLength = userMessages.length + botMessages.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputValue.trim();
    if (value.length < 10) return;

    chatbot.handleSubmit(value);
  };

  return (
    <div className="enter-from-bottom flex flex-col gap-2 bg-white h-[50svh] w-[calc(100vw-2rem)] max-w-150 p-2 rounded-xl shadow-[0_0_8px_-2px_rgba(0,0,0,0.3)]">
      {chatLength ? (
        <div className="flex-1 overflow-y-scroll" ref={chatScrollRef}>
          <ul
            className="flex flex-col gap-3 justify-end"
            aria-label="Chat messages"
          >
            {Array.from({ length: chatLength }).map((_, index) => {
              if (index % 2 === 0) {
                const userMessage = userMessages[index / 2];

                return (
                  <li key={index} className="flex justify-end mb-1">
                    <div className="enter-from-bottom max-w-[80%] rounded-2xl rounded-br-sm bg-orange-600 px-3 py-2">
                      <p className="style-label text-white wrap-break-word break-all">
                        {userMessage}
                      </p>
                    </div>
                  </li>
                );
              }

              const botMessage = botMessages[(index - 1) / 2];

              return (
                <li key={index} className="flex justify-start mb-1">
                  <div className="enter-from-bottom max-w-[80%] rounded-2xl rounded-bl-sm bg-white border border-gray-200 px-3 py-2 text-gray-900">
                    <p className="mb-2 style-label">
                      {botMessage.introduction}
                    </p>
                    {botMessage.petSitters.length > 0 && (
                      <ul className="flex flex-col gap-2 mb-4">
                        {botMessage.petSitters.map((sitter, index) => (
                          <li key={index}>
                            <h4
                              onClick={() => handleNavigate(sitter.sitterId)}
                              className="style-headline-4 hover:underline hover:cursor-pointer w-fit"
                            >
                              {`${index + 1}. ${sitter.tradeName}`}
                            </h4>
                            <p className="style-label">{sitter.description}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="style-label">
                      <span className="font-semibold">Confidence: </span>
                      {botMessage.confidence}
                    </p>
                  </div>
                </li>
              );
            })}
            {isLoading && (
              <li className="flex justify-start ml-3 mb-1 h-fit">
                <Loading className="min-h-0" />
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center style-body-2">
          <p className="style-body-2 text-center text-gray-600">
            No messages yet. Start a conversation!
          </p>
        </div>
      )}
      <div className="border-t border-gray-200" />
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          parentClassName="flex-1"
          key="chat-bot-input"
          value={inputValue}
          onChange={(event) => handleOnChange(event.target.value)}
          placeholder="Ask about pet sitters..."
          aria-label="Chatbot message input"
        />
        <ActionButton
          type="submit"
          variant="primary"
          className="min-w-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          aria-label="Send message to chatbot"
        >
          <SendHorizonal />
        </ActionButton>
      </form>
    </div>
  );
}

export default ChatbotContainer;
