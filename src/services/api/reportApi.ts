import { privateApi } from "./client";
import axios from "axios";
import { ReportData, ReportsData, ReportStatus } from "@/types/reportData";
interface ReportQueryParams {
  status?: Extract<ReportStatus, "new_report" | "pending" | "resolved" | "canceled">;
  page: number;
  limit: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateReportPayload = {
  booking_id: number;
  issue: string;
  description: string;
};

export const reportApi = {
  createReport: async (payload: CreateReportPayload) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(`${API_URL}/reports`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
  getReports: (params: ReportQueryParams): Promise<ReportsData> =>
    privateApi.get(`/admin/reports`, { params }).then((res) => res.data),
  getById: (reportId: number): Promise<ReportsData> =>
    privateApi.get(`/admin/reports/${reportId}`).then((res) => res.data),
  patchStatusReport: (reportId: number, status: ReportStatus): Promise<void> =>
    privateApi.patch(`/admin/reports/${reportId}/status`, { status }).then((res) => res.data),
};



