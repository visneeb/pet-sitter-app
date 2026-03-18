"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingApi } from "@/services/api/bookingApi";
import { BookingDetail } from "@/types/booking";

export default function PetSitterBooking() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingApi.getAll();
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              onClick={() => router.push(`/bookings/${booking.bookingId}`)}
              className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{booking.contactName}</p>
                  <p className="text-sm text-gray-500">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <span className="text-sm">{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}