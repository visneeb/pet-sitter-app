import { OwnerBookingHistory } from "@/types/BookingType";
import { BookingCardHeader } from "./booking-card/BookingCardHeader";
import { BookingCardDetails } from "./booking-card/BookingCardDetails";
import { BookingCardFooter } from "./booking-card/BookingCardFooter";

interface BookingCardProps {
  booking: OwnerBookingHistory;
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <div className="border border-gray-200 bg-white rounded-2xl">
      <div className="md:p-6 p-4">
        <div className="md:pb-9 pb-4">
          <BookingCardHeader
            tradeName={booking.tradeName}
            petSitterId={booking.petSitterId}
            sitterImgUrl={booking.sitterImgUrl}
            sitterName={booking.sitterName}
            status={booking.status}
            createdAt={booking.createdAt}
          />
          <div className="border-t border-gray-200 pb-4" />
          <BookingCardDetails
            startTime={booking.startTime}
            endTime={booking.endTime}
            pets={booking.pets}
            status={booking.status}
            sitter={{
              petSitterId: booking.petSitterId,
              tradeName: booking.tradeName,
              sitterName: booking.sitterName,
              sitterImgUrl: booking.sitterImgUrl,
            }}
          />
        </div>
        <BookingCardFooter
          status={booking.status}
          review={booking.review}
          bookingId={booking.bookingId}
        />
      </div>
    </div>
  );
}
