"use client";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/input/Select";
import useReport from "@/hooks/admin/reports/useReport";
import { useState } from "react";
import ReportListTile from "./ReportList";
import { REPORT_STATUS, ReportStatus } from "@/types/reportData";
import { useRouter } from "next/navigation";

const LIMIT_ITEMS = 10;
const DEFAULT_PAGE = 1;

export default function ReportTable() {
  const router = useRouter();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(LIMIT_ITEMS);
  const {
    reports,
    totalPages,
    currentPage,
    totalReports,
    loading,
    statusFilter,
    handleStatusChange,
  } = useReport({
    page,
    limit,
  });
  return (
    <section className="flex flex-col gap-6 min-h-[calc(100vh-40px)] px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex items-center justify-between">
        <p className="style-headline-3">Report</p>
        <Select
          className="w-60 h-[48px] style-body-2 text-gray-400 font-normal"
          placeholder="All status"
          value={statusFilter}
          onChange={(value) => handleStatusChange(value as ReportStatus)}
        >
          {REPORT_STATUS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </header>

      <article className="min-w-full">
        <header className="flex items-center py-3 bg-black rounded-t-2xl">
          <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(200/1120*100%)]">
            User
          </p>
          <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(200/1120*100%)]">
            Reported Pereson
          </p>
          <p className="hidden w-[calc(240/1120*100%)]  px-4 style-body-3 text-white md:block">
            Issue
          </p>
          <p className="hidden w-[calc(310/1120*100%)] px-4 style-body-3 text-white xl:block">
            Date Submitted
          </p>
          <p className="w-[calc(170/1120*100%)] min-w-25 px-4 style-body-3 text-white">
            Status
          </p>
        </header>
        {loading ? (
          <div className="flex items-center justify-center h-full rounded-b-2xl ">
            <span className="loading loading-spinner loading-xl text-gray-600" />
          </div>
        ) : (
          reports.map((report, index: number) => (
            <ReportListTile
              key={report.reportId.toString()}
              data={report}
              isLast={index + 1 === reports.length}
              onClick={() => {
                router.push(`/admin/reports/${report.reportId}`);
              }}
            />
          ))
        )}
      </article>

      <div className="flex flex-col items-center justify-center py-8 pb-16">
        <p className="style-body-2 text-gray-400">
          Total reports: {totalReports}
        </p>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setPage(page)}
        />
      </div>
    </section>
  );
}
