"use client";

import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { supabase } from "@/lib/supabaseClient";

interface Options {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useLogout({ onSuccess, onError }: Options = {}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    try {
      setIsLoggingOut(true);

      // Call backend logout first
      try {
        await authApi.logout();
      } catch (error) {
        // Backend logout might fail if session expired, but continue with Supabase logout
        console.warn("Backend logout failed:", error);
      }

      // Always logout from Supabase to clear local session
      await supabase.auth.signOut();

      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || "Logout failed";
      console.error("Logout error:", error);
      onError?.(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
  };
}
