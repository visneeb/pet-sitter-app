"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type { SitterReview } from "@/types/admin";

export interface UseReviewListOptions {
  limit?: number;
}

export interface UseReviewListResult {
  reviews: SitterReview[];
  totalReviews: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
}

const DEFAULT_LIMIT = 5;

export function useReviewList(
  sitterId?: string | null,
  options?: UseReviewListOptions,
  refreshKey?: number,
): UseReviewListResult {
  const limit = options?.limit ?? DEFAULT_LIMIT;

  const [page, setPage] = useState(1);
  const [state, setState] = useState<Omit<UseReviewListResult, "setPage">>({
    reviews: [],
    totalReviews: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    setPage(1);
  }, [sitterId, limit, refreshKey]);

  useEffect(() => {
    if (!sitterId) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Invalid pet sitter id",
        reviews: [],
        totalReviews: 0,
        totalPages: 1,
        currentPage: 1,
      }));
      return;
    }

    const controller = new AbortController();

    const fetchReviews = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getSitterReview(
          sitterId,
          { page, limit },
          controller.signal,
        );

        setState({
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
          totalReviews: data.totalReviews ?? 0,
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
              : "Failed to fetch sitter review list",
        }));
      }
    };

    fetchReviews();

    return () => {
      controller.abort();
    };
  }, [sitterId, page, limit, refreshKey]);

  return useMemo(
    () => ({
      ...state,
      setPage,
    }),
    [state, setPage],
  );
}
