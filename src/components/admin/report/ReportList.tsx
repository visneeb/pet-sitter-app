import cn from "@/utils/cn";
import { ReportData } from "@/types/reportData";
import { reportStatusVariant } from "@/constants/report/reportStatus";

interface ReportListTileProps {
  data: ReportData;
  isLast: boolean;
  onClick: () => void;
}

const revertReportStatus = {
  "New Report": "new_report",
  Pending: "pending",
  Resolved: "resolved",
  Canceled: "canceled",
} as const;

function ReportListTile(props: ReportListTileProps) {
  const { reportId, reporterName, reportedName, issue, status, createdAt } =
    props.data;
  const reportStatusKey =
    revertReportStatus[status as keyof typeof revertReportStatus];

  const date = new Date(createdAt);
  const datePart = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  
  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  
  const formatted = `${datePart} at ${timePart}`;

  return (
    <li
      key={reportId.toString()}
      className={cn(
        "flex items-center w-full h-23 bg-white",
        props.isLast ? "rounded-b-2xl" : "border-b border-gray-200",
      )}
      onClick={props.onClick}
    >
      <div className="flex flex-1 items-center md:w-[calc(200/1120*100%)] gap-2.5 px-4 py-6 overflow-hidden">
        <p className="style-body-2 text-black truncate">{reporterName}</p>
      </div>
      <div className="flex-1 px-4 style-body-2 text-black md:w-[calc(200/1120*100%)] truncate">
        {reportedName}
      </div>
      <div className="hidden w-[calc(240/1120*100%)]  px-4 style-body-2 text-black md:block truncate">
        {issue}
      </div>
      <div className="hidden w-[calc(310/1120*100%)] px-4 style-body-2 text-black xl:block truncate">
        {formatted}
      </div>
      <div
        className={cn(
          "flex items-center gap-2 w-[calc(170/1120*100%)] min-w-25 px-4 style-body-2",
          reportStatusVariant[reportStatusKey],
        )}
      >
        <span>•</span>
        {status}
      </div>
    </li>
  );
}

export default ReportListTile;
