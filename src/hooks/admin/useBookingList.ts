"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "@/services/api/admin";
import type { SitterBookingItem } from "@/types/admin";

export interface UseBookingListOptions {
  limit?: number;
}

export interface UseBookingListResult {
  bookings: SitterBookingItem[];
  totalBookings: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
}

const DEFAULT_LIMIT = 8;

export function useBookingList(
  sitterId?: string | null,
  options?: UseBookingListOptions,
  refreshKey?: number,
): UseBookingListResult {
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const [page, setPage] = useState(1);
  const [state, setState] = useState<Omit<UseBookingListResult, "setPage">>({
    bookings: [],
    totalBookings: 0,
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
        bookings: [],
        totalBookings: 0,
        totalPages: 1,
        currentPage: 1,
      }));
      return;
    }

    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const data = await adminApi.getSitterBooking(
          sitterId,
          { page, limit },
          controller.signal,
        );

        setState({
          bookings: Array.isArray(data.bookings) ? data.bookings : [],
          totalBookings: data.total ?? 0,
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
              : "Failed to fetch sitter booking list",
        }));
      }
    };

    fetchBookings();

    return () => {
      controller.abort();
    };
  }, [sitterId, page, limit, refreshKey]);

  return useMemo(
    () => ({
      ...state,
      setPage,
    }),
    [state],
  );
}
