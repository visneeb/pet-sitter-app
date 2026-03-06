import { Star } from "lucide-react";

interface ReviewCardProps {
  reviewerName: string;
  date: string;
  comment: string;
  avatarUrl?: string;
  isLast?: boolean;
}

export default function ReviewCard({
  reviewerName,
  date,
  comment,
  avatarUrl,
  isLast = false,
}: ReviewCardProps) {
  return (
    <div
      className={`flex gap-4 px-6 pt-6 pb-10 ${isLast ? "" : "border-b border-gray-200"}`}
    >
      <div className="flex gap-4 w-[220px]">
        <div className="bg-gray-200 rounded-full w-[56px] h-[56px] shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={reviewerName}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col">
          <p className="style-body-1">{reviewerName}</p>
          <p className="style-body-3 text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[516px]">
        <Star color="#1CCD83" fill="#1CCD83" size={20} />
        <p className="style-body-2 text-gray-500">{comment}</p>
      </div>
    </div>
  );
}
