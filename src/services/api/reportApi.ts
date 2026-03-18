import { ReportData, ReportsData, ReportStatus } from "@/types/reportData";
import { privateApi } from "./client";

interface ReportQueryParams {
  status?: Extract<ReportStatus, "new_report" | "pending" | "resolved" | "canceled">;
  page: number;
  limit: number;
}

export const reportApi = {
  getReports: (params: ReportQueryParams): Promise<ReportsData> =>
    privateApi.get(`/admin/reports`, { params }).then((res) => res.data),
  getById: (reportId: number): Promise<ReportData> =>
    privateApi.get(`/admin/reports/${reportId}`).then((res) => res.data),
};
