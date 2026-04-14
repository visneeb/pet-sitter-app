"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Textarea } from "../ui/input/CustomTextarea";
import { ActionButton } from "../ui/Button";
import { reviewApi } from "@/services/api/review";
import cn from "@/utils/cn";
import { BaseModal } from "./BaseModal";
import { CloseIcon } from "@/assets/icons/components";

type ReviewModalProps = {
  open: boolean;
  bookingId: number;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

export default function ReviewModal({
  open,
  bookingId,
  onClose,
  onSuccess,
  className,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // reset state
  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoveredRating(0);
      setComment("");
      setIsSubmitting(false);
      setErrorMessage("");
    }
  }, [open]);

  const displayRating = hoveredRating || rating;

  const handleSubmit = async () => {
    const trimmedComment = comment.trim();

    if (!rating) {
      setErrorMessage("Please select a rating.");
      return;
    }

    if (!trimmedComment) {
      setErrorMessage("Please write your review.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await reviewApi.createReview({
        booking_id: bookingId,
        rating,
        comment: trimmedComment,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Session expired. Please log in again.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <BaseModal open={open} onClose={onClose}>
      <div
        className ="max-h-[800px]"
      >

        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>


        <div className="flex items-center justify-between border-b border-gray-200 px-10 py-6 sm:px-10 sm:py-6">
          <h2 className="style-headline-4 text-gray-600 sm:style-headline-3">
            Rating & Review
          </h2>

          <button onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>


        <div className="flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-10 sm:py-6 md:px-10 md:py-10 h-full">
          {/* ⭐ rating */}
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-4 style-headline-3 text-gray-900 sm:mb-5 sm:text-2xl">
              What is your rate?
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isActive = starValue <= displayRating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform duration-150 hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={cn(
                        "transition-colors duration-150 sm:h-[48px] sm:w-[48px] md:h-[60px] md:w-[60px]",
                        isActive
                          ? "fill-[#1CCD83] text-[#1CCD83]"
                          : "fill-gray-300 text-gray-300"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

  
          <div className="mb-6">
            <p className="mb-3 text-center style-headline-3 text-gray-900 sm:mb-4">
              Share more about your experience
            </p>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your review..."
              rows={6}
              className="min-h-[140px] w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm"
            />
          </div>


          {errorMessage && (
            <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className=" px-4 pb-6 sm:px-10 sm:py-4 flex justify-between gap-4 ">
          <ActionButton
            variant="secondary"
            onClick={onClose}
            className="flex-1 whitespace-nowrap text-base sm:flex-none sm:min-w-[120px]"
          >
            Cancel
          </ActionButton>

          <ActionButton
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[1.6] whitespace-nowrap text-base sm:flex-none sm:min-w-[200px]"
          >
            {isSubmitting ? "Sending..." : "Send Review & Rating"}
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}

