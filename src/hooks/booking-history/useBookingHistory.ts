"use client";

import { useCallback, useEffect, useState } from "react";
import { bookingApi } from "@/services/api/booking";
import type { OwnerBookingHistory } from "@/types/BookingType";

const ITEMS_PER_PAGE = 6;

interface UseBookingHistoryReturn {
  bookings: OwnerBookingHistory[];
  paginatedBookings: OwnerBookingHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function useBookingHistory(): UseBookingHistoryReturn {
  const [bookings, setBookings] = useState<OwnerBookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const data = await bookingApi.getOwnerBookingHistory();
      setBookings(data);
    } catch (err) {
      setError("Could not load booking history.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    bookings,
    paginatedBookings,
    loading,
    error,
    refetch: fetchBookings,
    currentPage,
    totalPages,
    onPageChange,
  };
}
