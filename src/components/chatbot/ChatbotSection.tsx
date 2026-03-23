"use client";

import { useChatbotContext } from "@/contexts/ChatbotContext";
import ChatbotButton from "./ChatbotButton";
import ChatbotContainer from "./ChatbotContainer";
import { useAuth } from "@/contexts/AuthContext";

function ChatbotSection() {
  const { user } = useAuth();
  const chatbot = useChatbotContext();

  return (
    user?.role !== "sitter" &&
    user?.role !== "admin" && (
      <section aria-label="Chatbot">
        {chatbot.isOpen && (
          <div
            className="fixed inset-0 z-999"
            aria-hidden="true"
            onClick={chatbot.handleOpen}
          />
        )}
        <div className="fixed z-1000 bottom-4 right-4 flex flex-col items-end gap-3 md:bottom-6 md:right-6 xl:bottom-8 xl:right-8">
          {chatbot.isOpen && <ChatbotContainer chatbot={chatbot} />}
          {chatbot.showIntro && (
            <aside className="enter-from-bottom max-w-xs rounded-2xl rounded-br-sm bg-white px-4 py-3 shadow-[0_0_8px_-2px_rgba(0,0,0,0.3)] style-body-2 text-gray-800">
              Try searching with{" "}
              <span className="font-semibold text-orange-600">
                Pet Sitter Chatbot
              </span>
            </aside>
          )}
          <ChatbotButton handleOpen={chatbot.handleOpen} />
        </div>
      </section>
    )
  );
}

export default ChatbotSection;
