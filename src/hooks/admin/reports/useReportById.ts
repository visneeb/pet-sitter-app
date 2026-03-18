import { reportApi } from "@/services/api/reportApi";
import { useEffect, useState } from "react";
import { ReportData } from "@/types/reportData";

export function useReportById(reportId: number) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportApi.getById(reportId);
        // console.log(response);
        setReport(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);
  return { report, isLoading, error };
}
