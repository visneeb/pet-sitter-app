"use client";

import { BookingCard } from "./BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import { useBookingHistory } from "@/hooks/booking-history/useBookingHistory";

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
    <div className="flex flex-col gap-4">
      {paginatedBookings.map((booking) => (
        <BookingCard key={booking.bookingId} booking={booking} />
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
