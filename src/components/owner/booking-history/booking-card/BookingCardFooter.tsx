"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/Button";
import { PhoneAltIcon } from "@/assets/icons/components";
import { BookingStatus, BookingReview } from "@/types/BookingType";
import Link from "next/link";
import ReviewModal from "@/components/review/ReviewModal";
import ViewReviewModal from "@/components/review/ViewReviewModal";
import ReportModal from "@/components/report/ReportModal";
import PhoneNumberModal from "../PhoneCallModal";
import { formatBookingDateTime } from "@/utils/dateFormat";

interface BookingCardFooterProps {
  status: BookingStatus;
  review?: BookingReview | null;
  bookingId: number;
  petSitterId: number;
  sitterName: string;
  sitterImgUrl?: string | null;
  phoneNumber: string;
  completedAt: string | null;
  onReviewSuccess?: () => void;
}

const statusMessageMap: Record<BookingStatus, string> = {
  "Waiting for confirm": "Waiting Pet Sitter for confirm booking",
  "Waiting for service": "Your booking is currently being served",
  "In service": "Your pet is already in Pet Sitter care",
  Success: "Success date:",
  Canceled: "This booking has been canceled",
};

export function BookingCardFooter({
  status,
  review,
  bookingId,
  petSitterId,
  sitterName,
  sitterImgUrl,
  phoneNumber,
  completedAt,
  onReviewSuccess,
}: BookingCardFooterProps) {
  const router = useRouter();
  const isSuccess = status === "Success";
  const hasReviewed = !!review;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${isSuccess ? "bg-green-50" : "bg-gray-100"} rounded-2xl`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex md:flex-row flex-col justify-between md:items-center md:px-4 md:py-7 p-4">
        <p
          className={`style-body-3 md:pb-0 pb-4 ${
            isSuccess ? "text-green-500" : "text-gray-400"
          }`}
        >
          {status === "Success" && completedAt ? (
            <span className="flex flex-col">
              Success date: <span>{formatBookingDateTime(completedAt)}</span>
            </span>
          ) : (
            statusMessageMap[status]
          )}
        </p>

        <div className="flex gap-4 h-12">
          {isSuccess ? (
            <div className="flex flex-row md:gap-9 gap-4">
              <ActionButton
                variant="ghost"
                className="style-body-2 md:style-button"
                onClick={() => setIsReportOpen(true)}
              >
                Report
              </ActionButton>

              {hasReviewed ? (
                <ActionButton
                  variant="secondary"
                  className="style-body-2 md:style-button"
                  onClick={() => setIsViewReviewOpen(true)}
                >
                  Your Review
                </ActionButton>
              ) : (
                <ActionButton
                  variant="primary"
                  onClick={() => setIsReviewOpen(true)}
                  className="style-body-2 md:style-button"
                >
                  Review
                </ActionButton>
              )}
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center items-center">
              <Link href="/chat">
                <ActionButton
                  variant="primary"
                  className="style-body-2 md:style-button"
                >
                  Send Message
                </ActionButton>
              </Link>
              <ActionButton variant="icon" onClick={() => setIsOpen(true)}>
                <PhoneAltIcon />
              </ActionButton>
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        open={isReviewOpen}
        bookingId={bookingId}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={() => {
          setIsReviewOpen(false);
          onReviewSuccess?.();
        }}
      />
      <ReportModal
        open={isReportOpen}
        bookingId={bookingId}
        onClose={() => setIsReportOpen(false)}
        onSuccess={() => setIsReportOpen(false)}
      />

      {review && (
        <ViewReviewModal
          open={isViewReviewOpen}
          onClose={() => setIsViewReviewOpen(false)}
          sitterName={sitterName}
          sitterAvatar={sitterImgUrl ?? undefined}
          rating={review.rating}
          comment={review.comment}
          date={review.createdAt}
          onViewSitter={() => router.push(`/petsitter/${petSitterId}`)}
        />
      )}

      <PhoneNumberModal
        isOpen={isOpen}
        petSitterName={sitterName}
        phoneNumber={phoneNumber}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
