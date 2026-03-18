"use client";

import { ActionButton } from "@/components/ui/Button";
import { EditIcon } from "@/assets/icons/components";
import { BookingPet } from "@/types/BookingType";
import { formatDateRange, formatDuration } from "@/utils/timeFormat";

interface BookingCardDetailsProps {
  startTime: string;
  endTime: string;
  pets: BookingPet[];
  status: string;
  onChangeTime: () => void;
}

export function BookingCardDetails({
  startTime,
  endTime,
  pets,
  status,
  onChangeTime,
}: BookingCardDetailsProps) {
  const headStyle = "style-body-3 text-gray-400";
  const detailStyle = "text-gray-600 style-body-3 sm:style-body-2";
  const verticalLine =
    "self-stretch border-l border-gray-200 pr-8 h-10 my-auto md:flex hidden";

  const petNames = pets.map((p) => p.petName).join(", ") || "—";
  const isWait = status === "Waiting for confirm";

  return (
    <div className="grid md:grid-cols-4 grid-cols-1 items-center text-gray-700 gap-4">
      {/* Date & Time */}
      <div className="md:pr-7 pr-0 md:col-span-2">
        <p className={headStyle}>Date & Time:</p>
        <div className="flex items-center md:gap-3 gap-2">
          <p className={detailStyle}>{formatDateRange(startTime, endTime)}</p>
          <ActionButton
            variant="ghost"
            className={`${isWait ? "" : "hidden"}`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeTime();
            }}
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
  );
}
