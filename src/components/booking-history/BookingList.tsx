"use client";

import { useState } from "react";
import { BookingCard } from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { useBookingHistory } from "@/hooks/booking-history/useBookingHistory";
import { OwnerBookingHistory } from "@/types/BookingType";
import { BookingDetailModal } from "@/components/booking-history/BookingDetailModal";

export function BookingList() {
  const {
    paginatedBookings,
    loading,
    error,
    refetch,
    currentPage,
    totalPages,
    onPageChange,
  } = useBookingHistory();
  const [selectedBooking, setSelectedBooking] =
    useState<OwnerBookingHistory | null>(null);

  if (loading) return <p className="text-gray-400">Loading bookings...</p>;

  if (error)
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-red-500">{error}</p>
        <button onClick={refetch} className="text-pink-500 underline text-sm">
          Try again
        </button>
      </div>
    );

  if (paginatedBookings.length === 0)
    return <p className="text-gray-400">No bookings found.</p>;

  return (
    <>
      <div className="flex flex-col gap-4">
        {paginatedBookings.map((booking) => (
          <button
            key={booking.bookingId}
            onClick={() => setSelectedBooking(booking)}
            className="text-left w-full"
          >
            <BookingCard booking={booking} />
          </button>
        ))}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}
