export type BookingStatus =
  | "Waiting for confirm"
  | "Waiting for service"
  | "In service"
  | "Success"
  | "Canceled";

export const bookingStatusVariant: Record<BookingStatus, string> = {
  "Waiting for confirm": "text-pink-500",
  "Waiting for service": "text-yellow-200",
  "In service": "text-blue-500",
  Success: "text-green-500",
  Canceled: "text-red",
};
