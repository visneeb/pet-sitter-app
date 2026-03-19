import { reportApi } from "@/services/api/reportApi";
import { useEffect, useState } from "react";
import { ReportData } from "@/types/reportData";

export function useReportById(reportId: number) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const response = await reportApi.getById(reportId);
      const data = response.data;
      setReport(Array.isArray(data) ? (data[0] ?? null) : data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReport();
  }, [reportId]);

  return { report, isLoading, error, fetchReport };
}
