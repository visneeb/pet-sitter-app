"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type { OwnerProfileResponse } from "@/types/admin";
import { showCustomToast } from "@/components/ui/toast/Toast";

export interface UseOwnerProfileResult {
  ownerProfile: OwnerProfileResponse | null;
  isLoading: boolean;
  isModalLoading: boolean;
  error: string | null;
  modalError: string | null;
}

export function useOwnerProfile(userId?: string) {
  const router = useRouter();
  const [state, setState] = useState<UseOwnerProfileResult>({
    ownerProfile: null,
    isLoading: true,
    isModalLoading: false,
    error: null,
    modalError: null,
  });

  useEffect(() => {
    if (!userId) {
      setState((prev) => ({
        ...prev,
        ownerProfile: null,
        isLoading: false,
        error: "Invalid pet owner id",
      }));
      return;
    }

    const controller = new AbortController();

    const fetchOwnerProfile = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getOwnerById(userId, controller.signal);

        setState((prev) => ({
          ...prev,
          ownerProfile: data,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setState((prev) => ({
          ...prev,
          ownerProfile: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch owner profile",
        }));
      }
    };

    fetchOwnerProfile();

    return () => {
      controller.abort();
    };
  }, [userId]);

  useEffect(() => {
    if (!state.modalError) {
      return;
    }

    showCustomToast({
      title: "Ban owner",
      description: state.modalError,
      variant: "error",
    });
  }, [state.modalError]);

  const handleBan = async () => {
    if (!state.ownerProfile) return;

    setState((prev) => ({ ...prev, isModalLoading: true, modalError: null }));

    try {
      const response = await adminApi.banUser(state.ownerProfile.id);
      router.push("/admin/pet-owner");
      showCustomToast({
        title: "Ban owner",
        description: response.data?.message || "Ban owner successfully",
        variant: "success",
      });
    } catch {
      setState((prev) => ({ ...prev, modalError: "Failed to ban owner" }));
    } finally {
      setState((prev) => ({ ...prev, isModalLoading: false }));
    }
  };

  const handleUnban = async () => {
    if (!state.ownerProfile) return;

    setState((prev) => ({ ...prev, isModalLoading: true, modalError: null }));

    try {
      const response = await adminApi.unbanUser(state.ownerProfile.id);
      router.push("/admin/pet-owner");
      showCustomToast({
        title: "Ban owner",
        description: response.data?.message || "Unban owner successfully",
        variant: "success",
      });
    } catch {
      setState((prev) => ({ ...prev, modalError: "Failed to unban owner" }));
    } finally {
      setState((prev) => ({ ...prev, isModalLoading: false }));
    }
  };

  return useMemo(() => ({ ...state, handleBan, handleUnban }), [state]);
}
