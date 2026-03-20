"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "@/services/api/admin";
import type { BookingDetail } from "@/types/booking";

export interface UseBookingDetailResult {
  booking: BookingDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBookingDetail(
  bookingId?: string | number | null,
): UseBookingDetailResult {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (bookingId === undefined || bookingId === null || bookingId === "") {
      setBooking(null);
      setIsLoading(false);
      setError("Invalid booking id");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adminApi.getSitterBookingDetail(bookingId);
      setBooking(data);
    } catch (err) {
      setBooking(null);
      setError(err instanceof Error ? err.message : "Failed to fetch booking");
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return useMemo(
    () => ({
      booking,
      isLoading,
      error,
      refetch,
    }),
    [booking, isLoading, error, refetch],
  );
}
