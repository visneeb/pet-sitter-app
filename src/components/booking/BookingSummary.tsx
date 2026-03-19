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
    <div className="w-[280px] rounded-2xl bg-white overflow-hidden shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]">
      <div className="p-4 space-y-3 text-sm">
        <h2 className="font-semibold text-gray-900">Booking Detail</h2>

        <div>
          <p className="text-gray-500">Pet Sitter</p>
          <p className="text-gray-800">{sitterName}</p>
        </div>

        <div>
          <p className="text-gray-500">Date & Time</p>
          <p className="text-gray-800">
            {dateLabel} | {timeLabel}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Duration</p>
          <p className="text-gray-800">{hours} hours</p>
        </div>

        <div>
          <p className="text-gray-500">Pet</p>
          <p className="text-gray-800">
            {petNames.length > 0 ? petNames.join(", ") : "-"}
          </p>
        </div>
      </div>

      <div className="bg-black text-white px-4 py-3 flex justify-between text-sm">
        <span>Total</span>
        <span>{total.toFixed(2)} THB</span>
      </div>
    </div>
  );
}