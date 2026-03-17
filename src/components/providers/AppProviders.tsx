"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeedProvider } from "@/contexts/SeedContext";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { ScreenProvider } from "@/contexts/ScreenContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScreenProvider>
      <AuthProvider>
        <SeedProvider>
          <ChatbotProvider>{children}</ChatbotProvider>
        </SeedProvider>
      </AuthProvider>
    </ScreenProvider>
  );
}
