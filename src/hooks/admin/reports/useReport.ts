"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { reportApi } from "@/services/api/report";
import type { ReportData, ReportStatus } from "@/types/reportData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LIMIT = 10;

const STATUS_FROM_URL: Exclude<ReportStatus, "all">[] = [
  "new_report",
  "pending",
  "resolved",
  "canceled",
];

function parseStatusFromSearchParams(
  searchParams: URLSearchParams,
): ReportStatus {
  const raw = searchParams.get("status");
  if (!raw) return "all";
  return STATUS_FROM_URL.includes(raw as Exclude<ReportStatus, "all">)
    ? (raw as Exclude<ReportStatus, "all">)
    : "all";
}

function parsePageFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get("page");
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function useReport() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalReports, setTotalReports] = useState<number>(0);

  const statusFilter = useMemo(
    () => parseStatusFromSearchParams(searchParams),
    [searchParams],
  );

  const page = useMemo(
    () => parsePageFromSearchParams(searchParams),
    [searchParams],
  );

  const replaceQuery = useCallback(
    (mutate: (qs: URLSearchParams) => void) => {
      const qs = new URLSearchParams(searchParams.toString());
      mutate(qs);
      const url = qs.toString() ? `${pathname}?${qs.toString()}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (next: number) => {
      replaceQuery((qs) => {
        if (next <= 1) {
          qs.delete("page");
        } else {
          qs.set("page", String(next));
        }
      });
    },
    [replaceQuery],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      const next = value as ReportStatus;
      replaceQuery((qs) => {
        if (next === "all") {
          qs.delete("status");
        } else {
          qs.set("status", next);
        }
        qs.delete("page");
      });
    },
    [replaceQuery],
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiParams = {
          status: statusFilter === "all" ? undefined : statusFilter,
          page,
          limit: LIMIT,
        };

        const response = await reportApi.getReports(apiParams);

        setReports(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalReports(response.totalReports);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [statusFilter, page]);

  return {
    reports,
    totalPages,
    currentPage,
    totalReports,
    loading,
    error,
    statusFilter,
    handleStatusChange,
    setPage,
  };
}

export default useReport;
