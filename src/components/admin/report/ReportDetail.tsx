import { ActionProfileHeader } from "@/components/profile/ProfileHeader";
import { ActionButton } from "@/components/ui/Button";
import InformationContainer from "@/components/ui/InformationContainer";
import Modal from "@/components/ui/Modal";
import { reportStatusVariant } from "@/constants/report/reportStatus";
import { usePatchStatusReport } from "@/hooks/admin/reports/usePatchStatusReport";
import { useReportById } from "@/hooks/admin/reports/useReportById";
import { REPORT_STATUS } from "@/types/reportData";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ReportDetail() {
  const params = useParams();
  const reportId = Number(params.reportId);
  const { report, isLoading, error, fetchReport } = useReportById(reportId);
  const { handleResolveReport, handleCancelReport } = usePatchStatusReport(
    reportId,
    { onSuccess: fetchReport },
  );

  const showCancelModal = () => {
    const dialog = document.getElementById(
      "cancel-report",
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    dialog.showModal();
  };

  const showResolveModal = () => {
    const dialog = document.getElementById(
      "resolve-report",
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    dialog.showModal();
  };

  const reportStatus = REPORT_STATUS.find(
    (status) => status.label === report?.status,
  )?.value;

  const isCancelable =
    reportStatus !== "resolved" && reportStatus !== "canceled";

  const dateFormatted = report?.createdAt
    ? format(new Date(report.createdAt), "dd MMM, yyyy 'at' hh:mmaaa")
    : null;

  if (isLoading) {
    return (
      <section className="flex flex-col h-full items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col h-full items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Failed to load report.</p>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="flex flex-col h-full items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Report not found.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[24px] px-[40px] pt-[40px] pb-[80px]">
      <header>
        <ActionProfileHeader
          title={"Report Detail"}
          status={
            <span
              className={
                reportStatusVariant[
                  reportStatus as keyof typeof reportStatusVariant
                ]
              }
            >
              • {report.status}
            </span>
          }
          leftAction={
            <Link href="/admin/reports">
              <ChevronLeft />
            </Link>
          }
          action={
            isCancelable && (
              <div className="flex flex-row gap-[8px]">
                <ActionButton
                  variant="secondary"
                  disabled={!isCancelable}
                  onClick={showCancelModal}
                >
                  Cancel Report
                </ActionButton>
                <ActionButton
                  variant="primary"
                  disabled={!isCancelable}
                  onClick={showResolveModal}
                >
                  Resolve
                </ActionButton>
              </div>
            )
          }
        />
      </header>

      <article
        className={`flex flex-col bg-white gap-[24px] sm:gap-10 p-[40px]  rounded-2xl`}
      >
        <section className="flex flex-col gap-1 border-b border-gray-200 pb-4">
          <InformationContainer
            title="Reported by"
            detail={report.reporterName ? report.reporterName : "-"}
          />
        </section>
        <InformationContainer
          title="Reported Person"
          detail={report.reportedName ? report.reportedName : "-"}
        />
        <InformationContainer
          title="Issue"
          detail={report.issue ? report.issue : "-"}
        />
        <InformationContainer
          title="Description"
          detail={report.description ? report.description : "-"}
        />
        <InformationContainer
          title="Date Submitted"
          detail={dateFormatted ?? "-"}
        />
      </article>
      <Modal
        id="cancel-report"
        title="Cancel Report"
        massage="Are you sure to cancel this report?"
        cancelText="Cancel"
        confirmText="Cancel Report"
        onConfirm={handleCancelReport}
      />
      <Modal
        id="resolve-report"
        title="Resolve Report"
        massage="Has this report already been resolved?"
        cancelText="Cancel"
        confirmText="Resolved"
        onConfirm={handleResolveReport}
      />
    </section>
  );
}
