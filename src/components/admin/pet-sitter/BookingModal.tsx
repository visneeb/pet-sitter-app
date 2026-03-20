"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useBookingDetail } from "@/hooks/admin/useBookingDetail";
import Loading from "@/components/common/loading/loading";
import InformationContainer from "@/components/ui/InformationContainer";
import { format } from "date-fns";
import { BasePetCard } from "@/components/booking/BasePetCard";

function BookingModal({ bookingId }: { bookingId: number | null }) {
  const { booking, isLoading, error } = useBookingDetail(bookingId);

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch booking detail:", error);
    }
  }, [error]);

  return (
    <dialog id="booking-detail" className="modal">
      {booking ? (
        <div className="modal-box w-[calc(100%-2rem)] max-w-200 bg-white rounded-2xl p-0 overflow-y-visible">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 md:px-10 md:py-6">
            <h3 className="style-headline-3 text-black">
              {booking.petOwnerName}
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost md:right-4 md:top-3">
                <X className="size-5.5 text-gray-300" />
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[528px] p-4 sm:p-8 lg:p-10 lg:gap-10">
            <InformationContainer
              title="Pet Owner Name"
              detail={booking.petOwnerName}
            />
            <InformationContainer title="Pet(s)" detail={booking.pets.length} />
            <InformationContainer
              title="Pet Detail"
              detail={booking.pets.map((pet, index) => (
                <BasePetCard
                  variant="action"
                  className="shrink-0 hover:border-gray-200"
                  pet={{
                    id: String(index),
                    name: pet.petName,
                    type: pet.petType,
                    imgUrl: pet.imgUrl,
                  }}
                />
              ))}
              className="flex-row flex-nowrap gap-3 overflow-x-auto pb-2"
            />
            <InformationContainer title="Duration" detail={booking.duration} />
            <InformationContainer
              title="Booking Date"
              detail={`${format(
                booking.startTime,
                "dd MMM yyyy | h a",
              )} - ${format(booking.endTime, "h a")}`}
            />
            <InformationContainer
              title="Total Paid"
              detail={`${booking.totalPrice} THB`}
            />
            <InformationContainer
              title="Additional Message"
              detail={booking.note ?? "No data"}
            />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </dialog>
  );
}

export default BookingModal;
