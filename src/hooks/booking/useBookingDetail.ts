"use client";
import { useState, useEffect, useCallback } from "react";
import { bookingApi } from "@/services/api/bookingApi";
import type { BookingDetail } from "@/types/booking";

export function useBookingDetail(bookingId: number) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingApi.getById(bookingId);
      setBooking(data);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to fetch booking"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    refetch();
  }, [refetch]);
  return { booking, isLoading, error, refetch };
}
