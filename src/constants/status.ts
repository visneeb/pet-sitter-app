import { BookingStatus } from "@/types/BookingType";

export type UserStatus = "Normal" | "Banned";
export type SitterStatus =
  | "Unapproved"
  | "Waiting for approval"
  | "Approved"
  | "Rejected";

export const userStatusVariant: Record<UserStatus, string> = {
  Normal: "text-green-500",
  Banned: "text-red",
};

export const sitterStatusVariant: Record<
  SitterStatus | Extract<UserStatus, "Banned">,
  string
> = {
  Unapproved: "text-orange-500",
  "Waiting for approval": "text-pink-500",
  Approved: "text-green-500",
  Rejected: "text-red",
  Banned: "text-red",
};

export const statusStyleMap: Record<
  BookingStatus,
  { text: string; dot: string }
> = {
  "Waiting for confirm": { text: "text-pink-500", dot: "bg-pink-500" },
  "Waiting for service": { text: "text-yellow-200", dot: "bg-yellow-200" },
  "In service": { text: "text-blue-500", dot: "bg-blue-500" },
  Success: { text: "text-green-500", dot: "bg-green-500" },
  Canceled: { text: "text-red", dot: "bg-red" },
};
