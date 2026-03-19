"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import AvatarPlaceholder from "@/components/ui/AvatarPlaceholder";
import Markdown from "react-markdown";

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
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !avatarUrl || imgError;

  const renderStars = (className: string) => (
    <div className={`flex gap-[2px] ${className}`}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} color="#1CCD83" fill="#1CCD83" size={20} />
      ))}
    </div>
  );

  return (
    <div
      className={`flex flex-col lg:flex-row gap-4 lg:px-6 pt-6 pb-10 ${
        isLast ? "" : "border-b border-gray-200"
      }`}
    >
      {/* ส่วนซ้าย: จัดให้เป็น justify-between เพื่อผลักดาวไปชิดขวาบน Mobile */}
      <div className="flex justify-between lg:justify-start w-full lg:w-[220px] shrink-0">
        <div className="flex gap-4">
          <div className="shrink-0 overflow-hidden rounded-full w-[56px] h-[56px]">
            {showPlaceholder ? (
              <AvatarPlaceholder size="sm" />
            ) : (
              <img
                src={avatarUrl}
                alt={reviewerName}
                className="h-[56px] w-[56px] object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="flex flex-col">
            <p className="style-body-1">{reviewerName}</p>
            <p className="style-body-3 text-gray-400">{date}</p>
          </div>
        </div>

        {/* เรียกใช้ดาว: ให้แสดงผลเฉพาะบน Mobile (lg:hidden) และจัดให้อยู่ด้านบน (items-start) */}
        {renderStars("lg:hidden items-start")}
      </div>

      <div className="flex flex-col gap-4 w-full lg:max-w-[516px]">
        {/* เรียกใช้ดาว: ให้แสดงผลเฉพาะบน Desktop ขึ้นไป (hidden lg:flex) */}
        {renderStars("hidden lg:flex")}
        <div className="style-body-2 text-gray-500 w-full">
          <Markdown>{comment}</Markdown>
        </div>
      </div>
    </div>
  );
}
