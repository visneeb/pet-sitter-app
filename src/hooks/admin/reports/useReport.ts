import { useState, useEffect } from "react";
import { reportApi } from "@/services/api/reportApi";
import type { ReportData, ReportStatus } from "@/types/reportData";
import { useRouter } from "next/navigation";

interface UseReportParams {
  status?: "new_report" | "pending" | "resolved" | "cancelled";
  page: number;
  limit: number;
}

function useReport(props: UseReportParams) {
  const { page = 1, limit = 10 } = props;
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<ReportStatus>("all");
  const router = useRouter();
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ReportStatus);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // 1) สร้าง params สำหรับ API
        const apiParams = {
          status: statusFilter === "all" ? undefined : statusFilter, // "all" ไม่ส่งขึ้น backend
          page,
          limit,
        };
        // 2) สร้าง query string สำหรับ URL จาก apiParams
        const searchParams = new URLSearchParams();
        if (apiParams.status) searchParams.set("status", apiParams.status);
        searchParams.set("page", String(apiParams.page));
        searchParams.set("limit", String(apiParams.limit));
        const queryString = searchParams.toString();
        router.replace(`/admin/reports?${queryString}`, {
          scroll: false,
        });
        // 3) เรียก API ด้วย object ที่ type ตรง
        const response = await reportApi.getReports(apiParams);

        setReports(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalReports(response.totalReports);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [statusFilter, page, limit, router]);

  return {
    reports,
    totalPages,
    currentPage,
    totalReports,
    loading,
    error,
    statusFilter,
    handleStatusChange,
  };
}

export default useReport;
