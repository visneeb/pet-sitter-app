"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type { SitterProfileResponse } from "@/types/admin";

export interface UseSitterProfileResult {
  sitterProfile: SitterProfileResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useSitterProfile(sitterId?: string): UseSitterProfileResult {
  const [state, setState] = useState<UseSitterProfileResult>({
    sitterProfile: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!sitterId) {
      setState({
        sitterProfile: null,
        isLoading: false,
        error: "Invalid pet sitter id",
      });
      return;
    }

    const controller = new AbortController();

    const fetchSitterProfile = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getSitterById(sitterId, controller.signal);

        setState({
          sitterProfile: data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setState({
          sitterProfile: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch sitter profile",
        });
      }
    };

    fetchSitterProfile();

    return () => {
      controller.abort();
    };
  }, [sitterId]);

  return useMemo(() => state, [state]);
}
