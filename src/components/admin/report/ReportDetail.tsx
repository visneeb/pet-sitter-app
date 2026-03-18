import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import { ActionButton } from "@/components/ui/Button";
import InformationContainer from "@/components/ui/InformationContainer";
import { useReportById } from "@/hooks/admin/reports/useReportById";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReportDetail() {
  const params = useParams();
  const reportId = Number(params.reportId);
  const { report, isLoading, error } = useReportById(reportId);

  console.log(report);
  console.log(report?.reportedName);
  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Failed to load report.</p>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="flex flex-col items-center justify-center gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <p>Report not found.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[24px] px-[40px] pt-[40px] pb-[80px]">
      <header>
        <UserProfileHeader
          title={"Report Detail"}
          leftAction={
            <Link href="/admin/reports">
              <ChevronLeft />
            </Link>
          }
          action={
            <div className="flex flex-row gap-[8px]">
              <ActionButton variant="secondary">Cancel Report</ActionButton>
              <ActionButton variant="primary">Resolve</ActionButton>
            </div>
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
          detail={report.createdAt ? report.createdAt : "-"}
        />
      </article>
    </section>
  );
}
