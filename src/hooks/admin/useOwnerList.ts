"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSeed } from "@/contexts/SeedContext";
import { adminApi } from "@/services/api/admin";
import type { OwnerItem } from "@/types/admin";
import { UserStatus } from "@/constants/status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UseOwnerListOptions {
  limit?: number;
}

export interface UseOwnerListResult {
  owners: OwnerItem[];
  totalOwners: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  searchKeyword: string;
  statusFilter: UserStatus | null;
  handleKeywordChange: (value: string) => void;
  handleStatusChange: (value: UserStatus | null) => void;
  setPage: (page: number) => void;
}

const DEFAULT_LIMIT = 8;

export function useOwnerList(
  options?: UseOwnerListOptions,
): UseOwnerListResult {
  const { seed } = useSeed();
  const limit = options?.limit ?? DEFAULT_LIMIT;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [state, setState] = useState<
    Omit<
      UseOwnerListResult,
      | "searchKeyword"
      | "statusFilter"
      | "handleKeywordChange"
      | "handleStatusChange"
      | "setPage"
    >
  >({
    owners: [],
    totalOwners: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  });

  const statusFilter = useMemo((): UserStatus | null => {
    const raw = searchParams.get("status");
    if (raw === null || raw === "") return null;
    const lower = raw.toLowerCase();
    if (lower === "normal") return "Normal";
    if (lower === "banned") return "Banned";
    return null;
  }, [searchParams]);

  const applyStatusToUrl = useCallback(
    (next: UserStatus | null) => {
      const qs = new URLSearchParams(searchParams.toString());
      if (next === "Normal") {
        qs.set("status", "normal");
      } else if (next === "Banned") {
        qs.set("status", "banned");
      } else {
        qs.delete("status");
      }
      const url = qs.toString() ? `${pathname}?${qs.toString()}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPage(1);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [searchKeyword]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOwners = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const params = {
          ...(seed ? { seed } : {}),
          page,
          limit,
          ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        };

        const data = await adminApi.getOwnerList(params, controller.signal);

        setState({
          owners: Array.isArray(data.owners) ? data.owners : [],
          totalOwners: data.totalOwners ?? 0,
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
              : "Failed to fetch owner list",
        }));
      }
    };

    fetchOwners();

    return () => {
      controller.abort();
    };
  }, [debouncedKeyword, limit, page, seed, statusFilter]);

  const handleKeywordChange = (value: string) => {
    setSearchKeyword(value);
  };

  const handleStatusChange = (status: UserStatus | null) => {
    applyStatusToUrl(status);
  };

  return useMemo(
    () => ({
      ...state,
      searchKeyword,
      statusFilter,
      handleKeywordChange,
      handleStatusChange,
      setPage,
    }),
    [searchKeyword, state, statusFilter],
  );
}
