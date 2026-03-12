"use client";

import { useEffect, useState } from "react";
import { bookingApi } from "@/services/api/bookingApi";
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

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getOwnerBookingHistory();
      setBookings(data);
    } catch (err) {
      setError("Could not load booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const onPageChange = (page: number) => {
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
