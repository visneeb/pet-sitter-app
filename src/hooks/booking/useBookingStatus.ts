import { BookingStatus, StatusConfig } from "@/types/booking";

const useBookingStatus = (status: BookingStatus, endTime: string) => {
  const isBookingTimeEnded = new Date() >= new Date(endTime);

  const statusConfig: Record<BookingStatus, StatusConfig> = {
    "Waiting for confirm": {
      label: "Waiting for confirm",
      badgeClass: "text-orange-500",
      buttonLabel: "Confirm Booking",
      showReject: true,
      nextStatus: "Waiting for service",
    },
    "Waiting for service": {
      label: "Waiting for service",
      badgeClass: "text-orange-500",
      buttonLabel: "In Service",
      showReject: false,
      nextStatus: "In service",
    },
    "In service": {
      label: "In service",
      badgeClass: "text-green-500",
      buttonLabel: "Success",
      showReject: false,
      nextStatus: "Success",
      isDisabled: !isBookingTimeEnded,
    },
    Success: {
      label: "Success",
      badgeClass: "text-green-500",
      buttonLabel: null,
      showReject: false,
      nextStatus: null,
      isDisabled: true,
    },
    Canceled: {
      label: "Canceled",
      badgeClass: "text-red-500",
      buttonLabel: null,
      showReject: false,
      nextStatus: null,
    },
  };

  return statusConfig[status];
};

export default useBookingStatus;
