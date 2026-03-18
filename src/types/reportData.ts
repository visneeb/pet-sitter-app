export type ReportStatus = "all" | "new_report" | "pending" | "resolved" | "canceled";

export interface ReportData {
  reportId: number;
  reporterName: string;
  reportedName: string;
  issue: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetReportsParams {
  statusFilter?: ReportStatus;
  page: number;
  limit: number;
}

export interface ReportsData {
  data: ReportData[];
  totalPages: number;
  currentPage: number;
  totalReports: number;
}