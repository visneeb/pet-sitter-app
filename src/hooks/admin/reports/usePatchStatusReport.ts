import { reportApi } from "@/services/api/report";
import { ReportStatus } from "@/types/reportData";
import { useState } from "react";

export function usePatchStatusReport(
  reportId: number,
  options?: { onSuccess?: () => void },
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const patchStatus = async (status: string) => {
    try {
      setIsLoading(true);
      await reportApi.patchStatusReport(reportId, status as ReportStatus);
      options?.onSuccess?.(); // ยิงเสร็จแล้วสั่ง refetch
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveReport = () => patchStatus("Resolved");
  const handleCancelReport = () => patchStatus("Canceled");

  return { handleResolveReport, handleCancelReport, isLoading, error };
}
