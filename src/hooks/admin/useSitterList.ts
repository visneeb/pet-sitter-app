"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSeed } from "@/contexts/SeedContext";
import { adminApi } from "@/services/api/admin";
import type { SitterItem } from "@/types/admin";
import { SitterStatus, UserStatus } from "@/constants/status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SitterListStatus = SitterStatus | Extract<UserStatus, "Banned">;

const STATUS_SLUG: Record<SitterListStatus, string> = {
  Unapproved: "unapproved",
  "Waiting for approval": "waiting-for-approval",
  Approved: "approved",
  Rejected: "rejected",
  Banned: "banned",
};

const SLUG_TO_STATUS: Record<string, SitterListStatus> = {
  unapproved: "Unapproved",
  "waiting-for-approval": "Waiting for approval",
  approved: "Approved",
  rejected: "Rejected",
  banned: "Banned",
};

export interface UseSitterListOptions {
  limit?: number;
}

export interface UseSitterListResult {
  sitters: SitterItem[];
  totalSitters: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  searchKeyword: string;
  pendingUpdateFilter: boolean;
  statusFilter: SitterStatus | Extract<UserStatus, "Banned"> | null;
  handleKeywordChange: (value: string) => void;
  handleStatusChange: (
    value: SitterStatus | Extract<UserStatus, "Banned"> | null,
  ) => void;
  handlePendingUpdateChange: (value: boolean) => void;
  setPage: (page: number) => void;
}

const DEFAULT_LIMIT = 8;

export function useSitterList(
  options?: UseSitterListOptions,
): UseSitterListResult {
  const { seed } = useSeed();
  const limit = options?.limit ?? DEFAULT_LIMIT;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);

  const pendingUpdateFilter = useMemo(() => {
    const raw = searchParams.get("awaiting_approval");
    return raw === "true";
  }, [searchParams]);

  const statusFilter = useMemo((): SitterListStatus | null => {
    const raw = searchParams.get("status");
    if (raw === null || raw === "") return null;
    const key = raw.toLowerCase().trim();
    return SLUG_TO_STATUS[key] ?? null;
  }, [searchParams]);

  const replaceQuery = useCallback(
    (mutate: (qs: URLSearchParams) => void) => {
      const qs = new URLSearchParams(searchParams.toString());
      mutate(qs);
      const url = qs.toString() ? `${pathname}?${qs.toString()}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const [state, setState] = useState<
    Omit<
      UseSitterListResult,
      | "searchKeyword"
      | "pendingUpdateFilter"
      | "statusFilter"
      | "handleKeywordChange"
      | "handleStatusChange"
      | "handlePendingUpdateChange"
      | "setPage"
    >
  >({
    sitters: [],
    totalSitters: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPage(1);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [searchKeyword]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, pendingUpdateFilter]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSitters = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const params = {
          ...(seed ? { seed } : {}),
          page,
          limit,
          ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(pendingUpdateFilter ? { hasPendingUpdate: true } : {}),
        };

        const data = await adminApi.getSitterList(params, controller.signal);

        setState({
          sitters: Array.isArray(data.sitters) ? data.sitters : [],
          totalSitters: data.totalSitters ?? 0,
          totalPages: data.totalPages ?? 1,
          currentPage: data.currentPage ?? page,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch sitter list",
        }));
      }
    };

    fetchSitters();

    return () => {
      controller.abort();
    };
  }, [debouncedKeyword, limit, page, seed, statusFilter, pendingUpdateFilter]);

  const handleKeywordChange = (value: string) => {
    setSearchKeyword(value);
  };

  const handleStatusChange = (
    status: SitterStatus | Extract<UserStatus, "Banned"> | null,
  ) => {
    replaceQuery((qs) => {
      if (status === null) {
        qs.delete("status");
      } else {
        qs.set("status", STATUS_SLUG[status]);
      }
    });
  };

  const handlePendingUpdateChange = (value: boolean) => {
    replaceQuery((qs) => {
      if (value) {
        qs.set("awaiting_approval", "true");
      } else {
        qs.delete("awaiting_approval");
      }

      qs.delete("status");
    });
  };

  return useMemo(
    () => ({
      ...state,
      searchKeyword,
      statusFilter,
      pendingUpdateFilter,
      handleKeywordChange,
      handleStatusChange,
      handlePendingUpdateChange,
      setPage,
    }),
    [searchKeyword, state, statusFilter, pendingUpdateFilter],
  );
}
