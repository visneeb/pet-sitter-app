import { BookingStatus } from "@/types/BookingType";
import { UserIcon } from "@/assets/icons/components";

interface BookingCardHeaderProps {
  tradeName: string | null;
  petSitterId: number;
  sitterName: string | null;
  status: BookingStatus;
  createdAt: string;
  sitterImgUrl: string | undefined;
}

const statusStyleMap: Record<BookingStatus, { text: string; dot: string }> = {
  "Waiting for confirm": { text: "text-pink-500", dot: "bg-pink-500" },
  "Waiting for service": { text: "text-yellow-200", dot: "bg-yellow-200" },
  "In service": { text: "text-blue-500", dot: "bg-blue-500" },
  "Success": { text: "text-green-500", dot: "bg-green-500" },
  "Canceled": { text: "text-red", dot: "bg-red" },
};

function formatTransactionDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BookingCardHeader({
  tradeName,
  petSitterId,
  sitterName,
  status,
  createdAt,
  sitterImgUrl,
}: BookingCardHeaderProps) {
  const statusStyle = statusStyleMap[status] ?? {
    text: "text-gray-400",
    dot: "bg-gray-400",
  };

  return (
    <div className="flex flex-col md:flex-row justify-between lg:items-center items-start pb-4 gap-2 md:gap-0">
      <div className="flex flex-row items-center gap-4">
        {sitterImgUrl ? (
          <img
            src={sitterImgUrl}
            alt={sitterName ?? "Pet Sitter"}
            className="rounded-full md:size-16 size-9 aspect-square object-cover bg-gray-200"
          />
        ) : (
          <div className="rounded-full md:size-16 size-9 bg-gray-200 flex items-center justify-center text-white">
            <UserIcon className="size-5 md:size-7"/>
          </div>
        )}
        <p className="flex flex-col gap-1">
          <span className="md:style-headline-3 style-body-1">
            {tradeName ?? `Pet Sitter #${petSitterId}`}
          </span>
          <span className="md:style-body-1 style-body-3">By {sitterName}</span>
        </p>
      </div>
      <p className="flex flex-col md:gap-3 md:items-end items-start">
        <span className="style-body-3 text-gray-300">
          Transaction date: {formatTransactionDate(createdAt)}
        </span>
        <span
          className={`style-body-2 flex items-center gap-2.25 ${statusStyle.text}`}
        >
          <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
          {status}
        </span>
      </p>
    </div>
  );
}
