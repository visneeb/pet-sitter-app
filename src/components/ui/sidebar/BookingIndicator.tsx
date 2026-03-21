"use client";

import { useBookingList } from "@/hooks/booking/useBookingList";

export function BookingIndicator() {
  const { bookings } = useBookingList();
  const hasWaiting = bookings.some((b) => b.status === "Waiting for confirm");

  if (!hasWaiting) return null;

  return (
    <div className="p-1">
      <div className=" rounded-full size-1.5 bg-orange-500" />
    </div>
  );
}
