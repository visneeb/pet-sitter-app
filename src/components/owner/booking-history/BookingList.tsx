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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
        <BookingCard
          key={booking.bookingId}
          booking={booking}
          onRefresh={refetch}
        />
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
