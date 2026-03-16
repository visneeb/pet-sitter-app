"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type { OwnerProfileResponse } from "@/types/admin";

export interface UseOwnerProfileResult {
  ownerProfile: OwnerProfileResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useOwnerProfile(userId?: string): UseOwnerProfileResult {
  const [state, setState] = useState<UseOwnerProfileResult>({
    ownerProfile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setState({
        ownerProfile: null,
        isLoading: false,
        error: "Invalid pet owner id",
      });
      return;
    }

    const controller = new AbortController();

    const fetchOwnerProfile = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getOwnerById(userId, controller.signal);

        setState({
          ownerProfile: data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setState({
          ownerProfile: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch owner profile",
        });
      }
    };

    fetchOwnerProfile();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return useMemo(() => state, [state]);
}
