import type { SitterBookingList } from "@/types/BookingType";
import cn from "@/utils/cn";
import {
  BookingStatus,
  bookingStatusVariant,
} from "@/constants/bookinglist/bookingStatus";
import { Dot } from "lucide-react";
interface BookingListTileProps {
  booking: Omit<SitterBookingList, "createdAt" | "updatedAt">;
  isLast: boolean;
  onClick: () => void;
}

function BookingListTile(props: BookingListTileProps) {
  const { bookingId, petOwnerName, petCount, duration, bookingDate, status } =
    props.booking;
  const bookingStatus: BookingStatus = status;

  return (
    <li
      key={bookingId.toString()}
      className={cn(
        "flex items-center w-full h-23 bg-white hover:bg-gray-100",
        props.isLast ? "rounded-b-2xl" : "border-b border-gray-200",
      )}
      onClick={props.onClick}
    >
      <div className="flex flex-1 items-center md:w-[calc(240/1120*100%)] gap-2.5 px-4 py-6 overflow-hidden">
        {bookingStatus === "Waiting for confirm" && (
          <Dot className="size-8 text-orange-500" />
        )}
        <p className="style-body-2 text-black truncate">{petOwnerName}</p>
      </div>
      <div className="flex-1 px-4 style-body-2 text-black md:w-[calc(120/1120*100%)]">
        {petCount}
      </div>
      <div className="hidden w-[calc(120/1120*100%)] px-4 style-body-2 text-black md:block">
        {duration}
      </div>
      <div className="hidden w-[calc(420/1120*100%)] px-4 style-body-2 text-black xl:block">
        {bookingDate}
      </div>
      <div
        className={cn(
          "flex items-center gap-2 w-[calc(220/1120*100%)] min-w-25 px-4 style-body-2",
          bookingStatusVariant[bookingStatus],
        )}
      >
        <span>•</span>
        {bookingStatus}
      </div>
    </li>
  );
}

export default BookingListTile;
