"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSeed } from "@/contexts/SeedContext";
import { adminApi } from "@/services/api/admin";
import type { SitterItem } from "@/types/admin";
import { SitterStatus, UserStatus } from "@/constants/status";

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
  statusFilter: SitterStatus | Extract<UserStatus, "Banned"> | null;
  handleKeywordChange: (value: string) => void;
  handleStatusChange: (
    value: SitterStatus | Extract<UserStatus, "Banned"> | null,
  ) => void;
  setPage: (page: number) => void;
}

const DEFAULT_LIMIT = 8;

export function useSitterList(
  options?: UseSitterListOptions,
): UseSitterListResult {
  const { seed } = useSeed();
  const limit = options?.limit ?? DEFAULT_LIMIT;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    SitterStatus | Extract<UserStatus, "Banned"> | null
  >(null);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<
    Omit<
      UseSitterListResult,
      | "searchKeyword"
      | "statusFilter"
      | "handleKeywordChange"
      | "handleStatusChange"
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
  }, [statusFilter]);

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
  }, [debouncedKeyword, limit, page, seed, statusFilter]);

  const handleKeywordChange = (value: string) => {
    setSearchKeyword(value);
  };

  const handleStatusChange = (
    status: SitterStatus | Extract<UserStatus, "Banned"> | null,
  ) => {
    setStatusFilter(status);
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
