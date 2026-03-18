"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/assets/icons/components";
import { createPortal } from "react-dom";
import { BookingDetail } from "@/components/booking-detail/BookingDetail";
import { OwnerBookingHistory } from "@/types/BookingType";

interface BookingDetailModalProps {
  booking: OwnerBookingHistory;
  onClose: () => void;
  onChangeTime: () => void;
}

export function BookingDetailModal({
  booking,
  onClose,
  onChangeTime,
}: BookingDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      setIsClosing(true);
    } else {
      onClose();
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

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
        @media (max-width: 767px) {
          .mobile-bottom-sheet {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .mobile-bottom-sheet-closing {
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 transition-opacity"
        onClick={handleClose}
        role="presentation"
      >
        <div
          className={`bg-white rounded-t-3xl md:rounded-3xl shadow-xl w-full md:max-w-158 flex flex-col h-[95vh] md:h-auto md:max-h-[90vh] mobile-bottom-sheet ${isClosing ? "mobile-bottom-sheet-closing" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={handleAnimationEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-detail-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 md:px-10 px-4 py-6 shrink-0">
            <h2
              id="booking-detail-modal-title"
              className="style-headline-3 text-gray-600"
            >
              Booking Detail
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
          <BookingDetail booking={booking} onChangeTime={onChangeTime} />
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
