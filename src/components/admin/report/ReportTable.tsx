"use client";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/input/Select";
import useReport from "@/hooks/admin/reports/useReport";
import ReportListTile from "./ReportList";
import { REPORT_STATUS, ReportStatus } from "@/types/reportData";
import { useRouter } from "next/navigation";

export default function ReportTable() {
  const router = useRouter();
  const {
    reports,
    totalPages,
    currentPage,
    totalReports,
    loading: isLoading,
    error,
    statusFilter,
    handleStatusChange,
    setPage,
  } = useReport();
  return (
    <section className="flex flex-col gap-6 min-h-[calc(100vh-40px)] px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex items-center justify-between">
        <p className="style-headline-3 text-gray-600">Report</p>
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
        <header className="flex py-3 bg-black rounded-t-2xl">
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
        <ul>
          {reports.map((report, index, array) => (
            <ReportListTile
              key={report.reportId}
              data={report}
              isLast={index + 1 === array.length}
              onClick={() => {
                router.push(`/admin/reports/${report.reportId}`);
              }}
            />
          ))}
        </ul>

        {!isLoading && reports.length === 0 && (
          <p className="py-8 text-center style-body-2 text-gray-400">
            No reports found.
          </p>
        )}
      </article>

      <footer className="flex flex-col gap-2">
        {error && (
          <p className="style-body-2 text-red text-center">
            Failed to load report list:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        )}
        {isLoading && (
          <p className="style-body-2 text-gray-400 text-center">Loading...</p>
        )}
        {!isLoading && totalReports > 0 && (
          <p className="style-body-2 text-gray-400 text-center">
            Total reports: {totalReports}
          </p>
        )}
        <Pagination
          className="pt-0 pb-16"
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setPage(page)}
        />
      </footer>
    </section>
  );
}
