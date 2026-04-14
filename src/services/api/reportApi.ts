import { privateApi } from "./client";
import { ReportsData, ReportStatus } from "@/types/reportData";
interface ReportQueryParams {
  status?: Extract<
    ReportStatus,
    "new_report" | "pending" | "resolved" | "canceled"
  >;
  page: number;
  limit: number;
}

type CreateReportPayload = {
  booking_id: number;
  issue: string;
  description: string;
};

export const reportApi = {
  createReport: (payload: CreateReportPayload) =>
    privateApi.post("/reports", payload).then((res) => res.data),

  getReports: (params: ReportQueryParams): Promise<ReportsData> =>
    privateApi.get(`/admin/reports`, { params }).then((res) => res.data),

  getById: (reportId: number): Promise<ReportsData> =>
    privateApi.get(`/admin/reports/${reportId}`).then((res) => res.data),

  patchStatusReport: (reportId: number, status: ReportStatus): Promise<void> =>
    privateApi
      .patch(`/admin/reports/${reportId}/status`, { status })
      .then((res) => res.data),
};
