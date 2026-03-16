"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { PhoneAltIcon } from "@/assets/icons/components";
import { BookingStatus, BookingReview } from "@/types/BookingType";
import Link from "next/link";
import ReviewModal from "@/components/review/ReviewModal";

interface BookingCardFooterProps {
  status: BookingStatus;
  review?: BookingReview | null;
  bookingId: number;
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
}: BookingCardFooterProps) {
  const isSuccess = status === "Success";
  const hasReviewed = !!review;
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <div className={`${isSuccess ? "bg-green-50" : "bg-gray-100"} rounded-2xl`}>
      <div className="flex md:flex-row flex-col justify-between md:items-center md:px-4 md:py-7 p-4">
        <p
          className={`style-body-3 md:pb-0 pb-4 ${isSuccess ? "text-green-500" : "text-gray-400"}`}
        >
          {statusMessageMap[status]}
        </p>
        <div className="flex gap-4 h-12">
          {isSuccess ? (
            <div className="flex flex-row md:gap-9 gap-4">
              <ActionButton
                variant="ghost"
                className="style-body-2 md:style-button"
                onClick={(e) => e.stopPropagation()}
              >
                Report
              </ActionButton>
              {hasReviewed ? (
                <Link
                  href={`/review/${bookingId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButton
                    variant="secondary"
                    className="style-body-2 md:style-button"
                  >
                    Your Review
                  </ActionButton>
                </Link>
              ) : (
                <ActionButton
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReviewOpen(true);
                  }}
                  className="style-body-2 md:style-button"
                >
                  Review
                </ActionButton>
              )}
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center items-center">
              <Link href="/chat" onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  variant="primary"
                  className="style-body-2 md:style-button"
                >
                  Send Message
                </ActionButton>
              </Link>

              <ActionButton variant="icon" onClick={(e) => e.stopPropagation()}>
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
        }}
      />
    </div>
  );
}
