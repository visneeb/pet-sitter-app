"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeedProvider } from "@/contexts/SeedContext";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { ScreenProvider } from "@/contexts/ScreenContext";
import { ChatUnreadProvider } from "@/contexts/ChatUnreadContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScreenProvider>
      <AuthProvider>
        <ChatUnreadProvider>
          <SeedProvider>
            <ChatbotProvider>{children}</ChatbotProvider>
          </SeedProvider>
        </ChatUnreadProvider>
      </AuthProvider>
    </ScreenProvider>
  );
}
