import { Star } from "lucide-react";

interface ReviewCardProps {
  reviewerName: string;
  date: string;
  comment: string;
  avatarUrl?: string;
  rating: number;
  isLast?: boolean;
}

export default function ReviewCard({
  reviewerName,
  date,
  comment,
  avatarUrl,
  rating,
  isLast = false,
}: ReviewCardProps) {
  
  const renderStars = (className: string) => (
    <div className={`flex gap-[2px] ${className}`}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} color="#1CCD83" fill="#1CCD83" size={20} />
      ))}
    </div>
  );

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 md:px-6 pt-6 pb-10 ${
        isLast ? "" : "border-b border-gray-200"
      }`}
    >
      {/* ส่วนซ้าย: จัดให้เป็น justify-between เพื่อผลักดาวไปชิดขวาบน Mobile */}
      <div className="flex justify-between md:justify-start w-full md:w-[220px] shrink-0">
        <div className="flex gap-4">
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

        {/* เรียกใช้ดาว: ให้แสดงผลเฉพาะบน Mobile (md:hidden) และจัดให้อยู่ด้านบน (items-start) */}
        {renderStars("md:hidden items-start")}
      </div>

      <div className="flex flex-col gap-4 w-full md:max-w-[516px]">
        {/* เรียกใช้ดาว: ให้แสดงผลเฉพาะบน Desktop ขึ้นไป (hidden md:flex) */}
        {renderStars("hidden md:flex")}
        
        <p className="style-body-2 text-gray-500 w-full ">{comment}</p>
      </div>
    </div>
  );
}