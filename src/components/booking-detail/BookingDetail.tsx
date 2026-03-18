import { MapMarkerIcon, EditIcon } from "@/assets/icons/components";
import { OwnerBookingHistory } from "@/types/BookingType";
import { ActionButton } from "../ui/Button";
import {
  formatDateRange,
  formatDuration,
  formatTransactionDate,
} from "@/utils/timeFormat";
import { statusStyleMap } from "@/constants/status";

interface BookingDetailProps {
  booking: OwnerBookingHistory;
  onChangeTime: () => void;
  showStatus?: boolean;
  showChangeButton?: boolean;
}

export function BookingDetail({
  booking,
  onChangeTime,
  showStatus = true,
  showChangeButton = true,
}: BookingDetailProps) {
  const statusStyle = statusStyleMap[booking.status] ?? {
    text: "text-gray-400",
    dot: "bg-gray-400",
  };

  const petNames = booking.pets.map((p) => p.petName).join(", ") || "—";
  const isWait = booking.status === "Waiting for confirm";

  return (
    <div className="md:p-10 p-4 flex flex-col gap-6 overflow-y-auto flex-1">
      {/* Status */}
      {showStatus && (
        <span
          className={`flex items-center gap-2 style-body-2 font-normal ${statusStyle.text}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          {booking.status}
        </span>
      )}

      {/* Transaction info */}
      <div className="flex flex-col">
        <p className="style-body-2 font-normal text-gray-300">
          Booking date: {formatTransactionDate(booking.createdAt)}
        </p>
        <p className="style-body-2 font-normal text-gray-300">
          Transaction No. : {booking.bookingId}
        </p>
      </div>

      {/* Pet Sitter */}
      <div className="flex items-center justify-between">
        <div>
          <p className="style-body-3 text-gray-400">Pet Sitter:</p>
          <p className="style-body-2 text-gray-600 font-medium">
            {booking.tradeName ?? `Pet Sitter #${booking.petSitterId}`}
          </p>
        </div>
        <ActionButton variant="ghost">
          <MapMarkerIcon />
          View Map
        </ActionButton>
      </div>

      {/* Date & Time + Duration */}
      <div className="flex flex-row">
        <div className="grid md:grid-cols-2 w-full md:gap-10 gap-6">
          <div className="md:w-120 w-full">
            <p className="style-body-3 text-gray-400">Date & Time:</p>
            <div className="flex flex-row justify-between md:block">
              <p className="style-body-2 text-gray-600">
                {formatDateRange(booking.startTime, booking.endTime)}
              </p>
              {isWait && showChangeButton && (
                <ActionButton
                  variant="ghost"
                  onClick={onChangeTime}
                  className="self-end md:hidden flex"
                >
                  <EditIcon />
                  Change
                </ActionButton>
              )}
            </div>
          </div>
          <div className="md:pl-15">
            <p className="style-body-3 text-gray-400">Duration:</p>
            <p className="style-body-2 text-gray-600">
              {formatDuration(booking.startTime, booking.endTime)}
            </p>
          </div>
        </div>
        {isWait && showChangeButton && (
          <ActionButton
            variant="ghost"
            onClick={onChangeTime}
            className="self-end md:flex hidden"
          >
            <EditIcon />
            Change
          </ActionButton>
        )}
      </div>

      {/* Pet */}
      <div>
        <p className="style-body-3 text-gray-400">Pet:</p>
        <p className="style-body-2 text-gray-800">{petNames}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <p className="style-body-1 text-gray-600">Total</p>
        <p className="style-body-1 text-gray-600">{booking.totalPrice} THB</p>
      </div>
    </div>
  );
}
