"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Star, StarIcon } from "lucide-react";
import { Textarea } from "../ui/input/CustomTextarea";
import { ActionButton } from "../ui/Button";
import { reviewApi } from "@/services/api/reviewApi";
import cn from "@/utils/cn";

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
  className
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[820px] rounded-[32px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Rating & Review
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-10 text-center">
            <p className="mb-5 text-2xl font-semibold text-gray-900">
              What is your rate?
            </p>

            <div className="flex items-center justify-center gap-3">
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
                      size={60}
                      className={cn(
                        "transition-colors duration-150 hover:scale-120",
                        isActive
                          ? "text-[#1CCD83] fill-[#1CCD83]"
                          : "text-gray-300 fill-gray-300"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-4 text-center text-xl font-semibold text-gray-900">
              Share more about your experience
            </p>

            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder="Your review..."
              rows={6}
              className="min-h-[180px] w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#1CCD83] focus:outline-none"
            />
          </div>

          {errorMessage ? (
            <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
          ) : null}

          <div className="flex items-center justify-between">
            <ActionButton
              variant="secondary"
              type="button"
              onClick={onClose}
              className="min-w-[120px]"
            >
              Cancel
            </ActionButton>

            <ActionButton
              variant="primary"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? "Sending..." : "Send Review & Rating"}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}