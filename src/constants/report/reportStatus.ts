import { ReportStatus } from "@/types/reportData";

export const reportStatusVariant: Record<
  Extract<ReportStatus, "new_report" | "pending" | "resolved" | "canceled">,
  string
> = {
  new_report: "text-pink-500",
  pending: "text-blue-500",
  resolved: "text-green-500",
  canceled: "text-red",
};

export const reportStatusLabel = {
  new_report: "New Report",
  pending: "Pending",
  resolved: "Resolved",
  canceled: "Canceled",
};
