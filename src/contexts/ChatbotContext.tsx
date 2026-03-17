"use client";

import { createContext, useContext, type ReactNode } from "react";
import useChatbot from "@/hooks/chatbot/useChatbot";

const ChatbotContext = createContext<ReturnType<typeof useChatbot> | null>(
  null,
);

interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: Readonly<ChatbotProviderProps>) {
  const value = useChatbot();

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

export function useChatbotContext() {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbotContext must be used within a ChatbotProvider");
  }

  return context;
}
