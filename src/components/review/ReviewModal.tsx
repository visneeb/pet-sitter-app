"use client";

import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { Textarea } from "../ui/input/CustomTextarea";
import { ActionButton } from "../ui/Button";
import { reviewApi } from "@/services/api/reviewApi";
import cn from "@/utils/cn";
import { createPortal } from "react-dom";

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

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoveredRating(0);
      setComment("");
      setIsSubmitting(false);
      setErrorMessage("");
    }
  }, [open]);

  if (!open) return null;

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
      console.error("Create review failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 flex justify-center sm:items-center sm:inset-0 sm:px-4 sm:py-10">
        <div
          className={cn(
            "relative z-10 flex w-full flex-col overflow-hidden bg-white shadow-xl",
            "max-h-[90vh] rounded-t-[32px]",
            "sm:max-h-[calc(100vh-5rem)] sm:max-w-[820px] sm:rounded-[32px]",
            className,
          )}
        >
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Rating & Review
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 text-gray-500 transition hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
            <div className="mb-8 text-center sm:mb-10">
              <p className="mb-4 text-xl font-semibold text-gray-900 sm:mb-5 sm:text-2xl">
                What is your rate?
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isActive = starValue <= displayRating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      aria-label={`Rate ${starValue} star`}
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
                            : "fill-gray-300 text-gray-300",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-center font-semibold text-gray-900 sm:mb-4 text-[var(--font-size-headline-3)] ">
                Share more about your experience
              </p>

              <Textarea
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                placeholder="Your review..."
                rows={6}
                className="min-h-[140px] w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#1CCD83] focus:outline-none sm:min-h-[180px]"
              />
            </div>

            {errorMessage ? (
              <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
            ) : null}

            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <ActionButton
                variant="secondary"
                type="button"
                onClick={onClose}
                className="flex-1 whitespace-nowrap text-base sm:flex-none sm:min-w-[120px]"
              >
                Cancel
              </ActionButton>

              <ActionButton
                variant="primary"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-[1.6] whitespace-nowrap text-base sm:flex-none sm:min-w-[200px]"
              >
                {isSubmitting ? "Sending..." : "Send Review & Rating"}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
