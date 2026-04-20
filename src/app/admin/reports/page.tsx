import ReportTable from "@/components/admin/report/ReportTable";
import { Suspense } from "react";

export default function AdminReportsPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4 pt-10 pb-20 md:px-10 lg:p-0">
          <p className="style-body-2 text-gray-400">Loading...</p>
        </section>
      }
    >
      <ReportTable />
    </Suspense>
  );
}
