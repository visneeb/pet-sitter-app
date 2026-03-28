"use client";

import React from "react";
import { calcBookingTotal } from "@/domain/booking/pricing";

type Props = {
  sitterName: string;
  dateLabel: string;
  timeLabel: string;
  hours: number;
  petNames: string[];
};

export function BookingSummary({
  sitterName,
  dateLabel,
  timeLabel,
  hours,
  petNames,
}: Props) {
  const petCount = petNames.length;
  const safeHours = hours ?? 0;
  const total = calcBookingTotal(safeHours, petCount);

  return (
    <div className="w-full md:w-[396px] md:rounded-2xl bg-white overflow-hidden shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]">
      <div className="space-y-3 text-sm">
        <div className="h-[60px] md:h-[80px] border-b border-gray-200 p-6">
        <h2 className="style-headline-4 md:style-headline-3 text-gray-900">Booking Detail</h2>
        </div>

        <div className="h-[304px] md:h-[328px] bg-white p-6 flex flex-col gap-6 ">
        <div>
          <p className="text-gray-500 style-body-3">Pet Sitter</p>
          <p className="text-gray-800 style-body-2">{sitterName}</p>
        </div>

        <div>
          <p className="text-gray-500 style-body-3">Date & Time</p>
          <p className="text-gray-800 style-body-2">
            {dateLabel} | {timeLabel}
          </p>
        </div>

        <div>
          <p className="text-gray-500 style-body-3">Duration</p>
          <p className="text-gray-800 style-body-2">{hours} hours</p>
        </div>

        <div>
          <p className="text-gray-500 style-body-3">Pet</p>
          <p className="text-gray-800 style-body-2">
            {petNames.length > 0 ? petNames.join(", ") : "-"}
          </p>
          </div>
        </div>
      </div>

      <div className="bg-black text-white px-6 py-6 flex justify-between style-body-2 h-[76px] md:h-[76px]">
        <span>Total</span>
        <span>{total.toFixed(2)} THB</span>
      </div>
    </div>
  );
}