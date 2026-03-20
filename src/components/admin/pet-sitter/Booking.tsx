"use client";

import BookingListTile from "@/components/booking/booking-pet-sitter/BookingListTile";
import { Pagination } from "@/components/ui/Pagination";
import { useBookingList } from "@/hooks/admin/useBookingList";
import { useParams } from "next/navigation";
import { useState } from "react";
import BookingModal from "./BookingModal";
import { Paw } from "@/decorations/Paw";

function Booking() {
  const params = useParams<{ sitterId: string }>();
  const sitterId = params.sitterId;
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );

  const { bookings, totalPages, currentPage, isLoading, error, setPage } =
    useBookingList(sitterId, { limit: 8 });

  const handleOpenBookingDetailModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    const dialog = document.getElementById(
      "booking-detail",
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    dialog.showModal();
  };

  return (
    <>
      <section>
        <article className="min-w-full">
          {isLoading || bookings.length ? (
            <>
              <header className="flex py-3 bg-black rounded-t-2xl">
                <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(240/1120*100%)]">
                  Pet Owner Name
                </p>
                <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(120/1120*100%)]">
                  Pet(s)
                </p>
                <p className="hidden w-[calc(120/1120*100%)] px-4 style-body-3 text-white md:block">
                  Duration
                </p>
                <p className="hidden w-[calc(420/1120*100%)] px-4 style-body-3 text-white xl:block">
                  Booked Date
                </p>
                <p className="w-[calc(220/1120*100%)] min-w-25 px-4 style-body-3 text-white">
                  Status
                </p>
              </header>
              {error ? (
                <article className="rounded-b-2xl bg-white p-6">
                  <p className="style-body-2 text-red-600 text-center">
                    Failed to load bookings: {error}
                  </p>
                </article>
              ) : isLoading ? (
                <article className="rounded-b-2xl bg-white p-6">
                  <p className="style-body-2 text-gray-400 text-center">
                    Loading bookings...
                  </p>
                </article>
              ) : (
                <ul>
                  {bookings.map((booking, index, array) => (
                    <BookingListTile
                      key={booking.bookingId}
                      booking={booking}
                      isLast={index + 1 === array.length}
                      onClick={() =>
                        handleOpenBookingDetailModal(booking.bookingId)
                      }
                    />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center rounded-b-2xl bg-white p-12">
              <Paw className="size-16 text-pink-500" />
              <h4 className="style-headline-4 text-gray-500">
                No bookings found
              </h4>
            </div>
          )}
        </article>
        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            className="pt-10 pb-16"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
      <BookingModal bookingId={selectedBookingId} />
    </>
  );
}

export default Booking;
