export type UserStatus = "Normal" | "Banned";
export type SitterStatus = "Waiting for approval" | "Approved" | "Rejected";

export const userStatusVariant: Record<UserStatus, string> = {
  Normal: "text-green-500",
  Banned: "text-red",
};

export const sitterStatusVariant: Record<
  SitterStatus | Extract<UserStatus, "Banned">,
  string
> = {
  "Waiting for approval": "text-pink-500",
  Approved: "text-green-500",
  Rejected: "text-red",
  Banned: "text-red",
};
