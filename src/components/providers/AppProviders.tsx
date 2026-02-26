"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScreenProvider } from "@/contexts/ScreenContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScreenProvider>
      <AuthProvider>{children}</AuthProvider>
    </ScreenProvider>
  );
}
