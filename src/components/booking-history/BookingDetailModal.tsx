"use client";

import { useEffect, useState } from "react";
import { MapMarkerIcon, CloseIcon, EditIcon } from "@/assets/icons/components";
import { OwnerBookingHistory, BookingStatus } from "@/types/BookingType";
import { ActionButton } from "../ui/Button";
import {
  formatDateRange,
  formatDuration,
  formatTransactionDate,
} from "@/utils/timeFormat";
import { BookingModal } from "../pet-sitter-detail/BookingModal";

interface BookingDetailModalProps {
  booking: OwnerBookingHistory;
  onClose: () => void;
}

const statusStyleMap: Record<BookingStatus, { text: string; dot: string }> = {
  "Waiting for confirm": { text: "text-pink-500", dot: "bg-pink-500" },
  "Waiting for service": { text: "text-amber-500", dot: "bg-amber-500" },
  "In service": { text: "text-blue-500", dot: "bg-blue-500" },
  Success: { text: "text-green-500", dot: "bg-green-500" },
  Canceled: { text: "text-red-500", dot: "bg-red-500" },
};

export function BookingDetailModal({
  booking,
  onClose,
}: BookingDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const statusStyle = statusStyleMap[booking.status] ?? {
    text: "text-gray-400",
    dot: "bg-gray-400",
  };
  const petNames = booking.pets.map((p) => p.petName).join(", ") || "—";
  const isWait = booking.status === "Waiting for confirm";

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

  return (
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
          className={`bg-white rounded-t-3xl md:rounded-3xl shadow-xl w-full md:max-w-150  flex flex-col h-[95vh] md:h-auto md:max-h-[90vh] mobile-bottom-sheet ${isClosing ? "mobile-bottom-sheet-closing" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={handleAnimationEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-detail-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-10 py-6 shrink-0">
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
          <div className="p-10 flex flex-col gap-6 overflow-y-auto flex-1">
            {/* Status */}
            <span
              className={`flex items-center gap-2 style-body-2 font-normal ${statusStyle.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              {booking.status}
            </span>

            {/* Transaction info */}
            <div className="flex flex-col">
              <p className="style-body-2 font-normal text-gray-300">
                Transaction date: {formatTransactionDate(booking.createdAt)}
              </p>
              <p className="style-body-2 font-normal text-gray-300">
                Transaction No. : {booking.bookingId}
              </p>
            </div>

            {/* Pet Sitter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="style-body-3 text-gray-400">Pet Sitter:</p>
                <p className="style-body-2 text-gray-600 font-medium">
                  {booking.tradeName ?? `Pet Sitter #${booking.petSitterId}`}
                </p>
              </div>
              <ActionButton variant="ghost">
                <MapMarkerIcon />
                View Map
              </ActionButton>
            </div>

            {/* Date & Time + Duration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="style-body-3 text-gray-400">Date & Time:</p>
                <div className="flex flex-row justify-between md:block">
                  <p className="style-body-2 text-gray-600">
                    {formatDateRange(booking.startTime, booking.endTime)}
                  </p>

                  {isWait && (
                    <ActionButton
                      variant="ghost"
                      onClick={() => setIsBooking(true)}
                      className="self-end"
                    >
                      <EditIcon />
                      Change
                    </ActionButton>
                  )}
                </div>
              </div>
              <div>
                <p className="style-body-3 text-gray-400">Duration:</p>
                <p className="style-body-2 text-gray-600">
                  {formatDuration(booking.startTime, booking.endTime)}
                </p>
              </div>
            </div>

            {/* Pet */}
            <div>
              <p className="style-body-3 text-gray-400">Pet:</p>
              <p className="style-body-2 text-gray-800">{petNames}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <p className="style-body-1 text-gray-600">Total</p>
              <p className="style-body-1 text-gray-600">
                {booking.totalPrice} THB
              </p>
            </div>
          </div>
        </div>
      </div>
      {isBooking && (
        <BookingModal
          sitter={{ tradeName: booking.tradeName }}
          onClose={() => setIsBooking(false)}
          onConfirm={() => setIsBooking(false)}
        />
      )}
    </>
  );
}
