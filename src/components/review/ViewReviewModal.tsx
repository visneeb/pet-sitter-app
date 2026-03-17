"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/ui/Button";
import { CloseIcon } from "@/assets/icons/components";
import { StarRating } from "@/components/review/star-rating/StarRating";
import { createPortal } from "react-dom";

type ViewReviewModalProps = {
  open: boolean;
  onClose: () => void;
  sitterName: string;
  sitterAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  onViewSitter?: () => void;
};

export default function ViewReviewModal({
  open,
  onClose,
  sitterName,
  sitterAvatar,
  rating,
  comment,
  date,
  onViewSitter,
}: ViewReviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleClose = () => {
    if (isClosing) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    if (isMobile) {
      setIsClosing(true);
    } else {
      onClose();
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) onClose();
  };

  if (!mounted || !open) return null;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const modalContent = (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        @media (max-width: 639px) {
          .mobile-bottom-sheet {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .mobile-bottom-sheet-closing {
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 transition-opacity"
        onClick={handleClose}
        role="presentation"
      >
        <div
          className={`bg-white rounded-t-2xl sm:rounded-3xl shadow-xl w-full sm:max-w-200 flex flex-col sm:h-full sm:max-h-150 mobile-bottom-sheet ${isClosing ? "mobile-bottom-sheet-closing" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={handleAnimationEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-review-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-10 py-6">
            <h2
              id="view-review-modal-title"
              className="style-headline-3 text-gray-600"
            >
              Rating & Review
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="text-gray-600 transition hover:text-gray-400 hover:cursor-pointer"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 pt-10 pb-20 sm:px-10 flex flex-col gap-6 overflow-y-auto flex-1">
            <div className="flex flex-col gap-4 sm:px-6 pb-10 sm:pb-4">
              {/* Mobile: Avatar + Name/Date row | Stars right — Desktop: Avatar + Name/Date | Stars+Comment */}
              <div className="flex flex-row items-start gap-6">
                {/* Avatar */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {sitterAvatar ? (
                    <Image
                      src={sitterAvatar}
                      alt={`${sitterName}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                      {sitterName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Mobile: Name/Date + Stars justified apart | Desktop: Name/Date then Stars+Comment stacked */}
                <div className="flex flex-1 flex-row sm:flex-row items-start gap-6 sm:gap-10">
                  {/* Name + Date */}
                  <div className="flex flex-col gap-y-0.5 min-w-30">
                    <p className="style-body-1 text-black">{sitterName}</p>
                    <p className="style-body-3 text-gray-400">
                      {formattedDate}
                    </p>
                  </div>

                  {/* Mobile: stars pushed right | Desktop: stars + comment stacked */}
                  <div className="flex flex-col items-start gap-4 sm:ml-0 ml-auto">
                    <StarRating rating={rating} />
                    <p className="style-body-2 text-gray-500 hidden sm:block">
                      {comment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment mobile only */}
              <p className="style-body-2 text-gray-500 sm:hidden">{comment}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />
          </div>

          {/* Footer */}
          <div className="p-10 shrink-0 flex justify-center">
            <ActionButton variant="secondary" onClick={() => onViewSitter?.()}>
              View Pet Sitter
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
