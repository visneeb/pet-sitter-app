"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { EditIcon } from "@/assets/icons/components";
import { BookingPet } from "@/types/BookingType";
import { BookingModal } from "@/components/pet-sitter-detail/BookingModal";
import { formatDateRange, formatDuration } from "@/utils/timeFormat";

interface BookingCardDetailsProps {
  startTime: string;
  endTime: string;
  pets: BookingPet[];
  status: string;
  sitter: any;
}

export function BookingCardDetails({
  startTime,
  endTime,
  pets,
  status,
  sitter,
}: BookingCardDetailsProps) {
  const headStyle = "style-body-3 text-gray-400";
  const detailStyle = "text-gray-600 style-body-3 sm:style-body-2";
  const verticalLine =
    "self-stretch border-l border-gray-200 pr-8 h-10 my-auto md:flex hidden";

  const petNames = pets.map((p) => p.petName).join(", ") || "—";
  const isWait = status === "Waiting for confirm";
  const [isBooking, setIsBooking] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-4 grid-cols-1 items-center text-gray-700 gap-4">
        {/* Date & Time */}
        <div className="md:pr-6 pr-0 md:col-span-2">
          <p className={headStyle}>Date & Time:</p>
          <div className="flex items-center md:gap-3 gap-2">
            <p className={detailStyle}>{formatDateRange(startTime, endTime)}</p>
            <ActionButton
              variant="ghost"
              className={`${isWait ? "" : "hidden"}`}
              onClick={() => setIsBooking(true)}
            >
              <EditIcon />
              Change
            </ActionButton>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center">
          <div className={verticalLine} />
          <div>
            <p className={headStyle}>Duration:</p>
            <p className={detailStyle}>{formatDuration(startTime, endTime)}</p>
          </div>
        </div>

        {/* Pet */}
        <div className="flex items-center">
          <div className={verticalLine} />
          <div>
            <p className={headStyle}>Pet:</p>
            <p className={detailStyle}>{petNames}</p>
          </div>
        </div>
      </div>

      {isBooking && (
        <BookingModal
          sitter={sitter}
          onClose={() => setIsBooking(false)}
          onConfirm={() => setIsBooking(false)}
        />
      )}
    </>
  );
}
