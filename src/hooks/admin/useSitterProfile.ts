"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type {
  SitterPendingUpdateResponse,
  SitterProfileResponse,
} from "@/types/admin";
import { showCustomToast } from "@/components/ui/toast/Toast";

export interface UseSitterProfileResult {
  sitterProfile: SitterProfileResponse | null;
  sitterPendingProfile: SitterPendingUpdateResponse | null;
  isLoading: boolean;
  isModalLoading: boolean;
  error: string | null;
  modalError: string | null;
}

export function useSitterProfile(sitterId?: string, refreshKey?: number) {
  const router = useRouter();
  const [state, setState] = useState<UseSitterProfileResult>({
    sitterProfile: null,
    sitterPendingProfile: null,
    isLoading: false,
    isModalLoading: false,
    error: null,
    modalError: null,
  });

  useEffect(() => {
    if (!sitterId) {
      setState((prev) => ({
        ...prev,
        sitterProfile: null,
        isLoading: false,
        error: "Invalid pet sitter id",
      }));
      return;
    }

    const controller = new AbortController();

    const fetchSitterProfile = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getSitterById(sitterId, controller.signal);

        setState((prev) => ({
          ...prev,
          sitterProfile: data,
          error: null,
        }));

        if (data.hasPendingUpdate) {
          const pendingData = await adminApi.getSitterPendingUpdateById(
            sitterId,
            controller.signal,
          );

          setState((prev) => ({
            ...prev,
            sitterPendingProfile: pendingData,
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            sitterPendingProfile: null,
          }));
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setState((prev) => ({
          ...prev,
          sitterProfile: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch sitter profile",
        }));
      }
    };

    fetchSitterProfile();

    return () => {
      controller.abort();
    };
  }, [sitterId, refreshKey]);

  useEffect(() => {
    if (!state.modalError) {
      return;
    }

    showCustomToast({
      title: "Ban sitter",
      description: state.modalError,
      variant: "error",
    });
  }, [state.modalError]);

  const handleApprove = async () => {
    if (!state.sitterProfile) return;

    setState((prev) => ({ ...prev, isModalLoading: true, modalError: null }));

    try {
      const response = await adminApi.approveUpdateSitter(
        state.sitterProfile.id,
      );
      router.refresh();
      showCustomToast({
        title: "Approve sitter",
        description: response.data?.message || "Approve sitter successfully",
        variant: "success",
      });
    } catch (error) {
      setState((prev) => ({ ...prev, modalError: "Failed to approve sitter" }));
    } finally {
      setState((prev) => ({ ...prev, isModalLoading: false }));
    }
  };

  const handleBan = async () => {
    if (!state.sitterProfile) return;

    setState((prev) => ({ ...prev, isModalLoading: true, modalError: null }));

    try {
      const response = await adminApi.banUser(state.sitterProfile.sitter.id);
      router.push("/admin/pet-sitter");
      showCustomToast({
        title: "Ban sitter",
        description: response.data?.message || "Ban sitter successfully",
        variant: "success",
      });
    } catch (error) {
      setState((prev) => ({ ...prev, modalError: "Failed to ban sitter" }));
    } finally {
      setState((prev) => ({ ...prev, isModalLoading: false }));
    }
  };

  const handleUnban = async () => {
    if (!state.sitterProfile) return;

    setState((prev) => ({ ...prev, isModalLoading: true, modalError: null }));

    try {
      const response = await adminApi.unbanUser(state.sitterProfile.sitter.id);
      router.push("/admin/pet-sitter");
      showCustomToast({
        title: "Ban sitter",
        description: response.data?.message || "Unban sitter successfully",
        variant: "success",
      });
    } catch {
      setState((prev) => ({ ...prev, modalError: "Failed to unban sitter" }));
    } finally {
      setState((prev) => ({ ...prev, isModalLoading: false }));
    }
  };

  return useMemo(
    () => ({ ...state, handleApprove, handleBan, handleUnban }),
    [state],
  );
}
