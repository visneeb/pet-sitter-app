"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { OwnerBookingHistory, BookingStatus } from "@/types/BookingType";
import { BookingCardHeader } from "./booking-card/BookingCardHeader";
import { BookingCardDetails } from "./booking-card/BookingCardDetails";
import { BookingCardFooter } from "./booking-card/BookingCardFooter";
import { BookingDetailModal } from "@/components/owner/booking-history/BookingDetailModal";
import {
  BookingModal,
  BookingFormValues,
  type ModalAction,
} from "@/components/pet-sitter-detail/BookingModal";
import { bookingApi } from "@/services/api/bookingApi";

interface BookingCardProps {
  booking: OwnerBookingHistory;
}

const statusBorderMap: Record<BookingStatus, string> = {
  "Waiting for confirm": "border-gray-200",
  "Waiting for service": "border-gray-200",
  "In service": "border-blue-500",
  Success: "border-gray-200",
  Canceled: "border-gray-200",
};

export function BookingCard({ booking }: BookingCardProps) {
  const [currentStartTime, setCurrentStartTime] = useState(booking.startTime);
  const [currentEndTime, setCurrentEndTime] = useState(booking.endTime);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChangeTimeOpen, setIsChangeTimeOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDetailOpenRef = useRef(false);
  const isChangeTimeOpenRef = useRef(false);

  useEffect(() => {
    isDetailOpenRef.current = isDetailOpen;
  }, [isDetailOpen]);

  useEffect(() => {
    isChangeTimeOpenRef.current = isChangeTimeOpen;
  }, [isChangeTimeOpen]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleClick = (e: MouseEvent) => {
      if (isDetailOpenRef.current) return;
      if (isChangeTimeOpenRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;
      setIsDetailOpen(true);
    };

    card.addEventListener("click", handleClick);
    return () => card.removeEventListener("click", handleClick);
  }, []);

  const handleConfirm = useCallback(
    async (data: BookingFormValues) => {
      try {
        const startDateTime = new Date(data.startDate!);
        const [startHour, startMin] = data.startTime.split(":").map(Number);
        startDateTime.setHours(startHour, startMin, 0, 0);

        const endDateTime = new Date(data.endDate ?? data.startDate!);
        const [endHour, endMin] = data.endTime.split(":").map(Number);
        endDateTime.setHours(endHour, endMin, 0, 0);

        await bookingApi.updateBookingTime(
          booking.bookingId,
          startDateTime.toISOString(),
          endDateTime.toISOString(),
        );

        setCurrentStartTime(startDateTime.toISOString());
        setCurrentEndTime(endDateTime.toISOString());
        setIsChangeTimeOpen(false);
      } catch (error) {
        console.error("Failed to update booking time:", error);
      }
    },
    [booking.bookingId],
  );

  const confirm: ModalAction[] = [
    { label: "Confirm", type: "submit", variant: "primary" },
  ];

  return (
    <>
      <div
        ref={cardRef}
        className={`${statusBorderMap[booking.status]} border bg-white rounded-2xl cursor-pointer`}
      >
        <div className="md:p-6 p-4">
          <div className="md:pb-9 pb-4">
            <BookingCardHeader
              tradeName={booking.tradeName}
              petSitterId={booking.petSitterId}
              sitterImgUrl={booking.sitterImgUrl}
              sitterName={booking.sitterName}
              status={booking.status}
              createdAt={booking.createdAt}
            />
            <div className="border-t border-gray-200 pb-4" />
            <BookingCardDetails
              startTime={currentStartTime}
              endTime={currentEndTime}
              pets={booking.pets}
              status={booking.status}
              onChangeTime={() => setIsChangeTimeOpen(true)}
            />
          </div>
          <BookingCardFooter
            status={booking.status}
            review={booking.review}
            bookingId={booking.bookingId}
            petSitterId={booking.petSitterId}
            sitterName={booking.sitterName ?? ""}
            sitterImgUrl={booking.sitterImgUrl}
            phoneNumber={booking.sitterPhone ?? ""}
          />
        </div>
      </div>

      {isDetailOpen && (
        <BookingDetailModal
          booking={{
            ...booking,
            startTime: currentStartTime,
            endTime: currentEndTime,
          }}
          onClose={() => setIsDetailOpen(false)}
          onChangeTime={() => {
            setIsDetailOpen(false);
            setIsChangeTimeOpen(true);
          }}
        />
      )}

      {isChangeTimeOpen && (
        <BookingModal
          sitter={{ tradeName: booking.tradeName }}
          onClose={() => setIsChangeTimeOpen(false)}
          onConfirm={handleConfirm}
          actions={confirm}
        />
      )}
    </>
  );
}
