// src/components/booking/ProgressBar.tsx
"use client";

import React from "react";
import cn from "@/utils/cn";

type Step = {
  key: string;
  label: string;
};

type Props = {
  /** 1, 2, 3 */
  currentStep: 1 | 2 | 3;
  /** override steps ได้ ถ้าต้องการ */
  steps?: Step[];
  className?: string;
};

const defaultSteps: Step[] = [
  { key: "pet", label: "Your Pet" },
  { key: "info", label: "Information" },
  { key: "payment", label: "Payment" },
];

export function ProgressBar({ currentStep, steps = defaultSteps, className }: Props) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-white px-10 py-4 shadow-sm flex",
        className
      )}
      aria-label="Booking progress"
    >
      <ol className="flex gap-30 w-full justify-center">
        {steps.map((s, idx) => {
          const stepNumber = (idx + 1) as 1 | 2 | 3;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          return (
            <li key={s.key} className="flex ">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8  justify-center rounded-full text-sm font-semibold text-center",
                    isActive && "bg-orange-500 text-white",
                    isDone && "bg-black text-orange-600",
                    isUpcoming && "bg-gray-100 text-gray-400"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {stepNumber}
                </div>

                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-orange-600",
                    isDone && "text-gray-700",
                    isUpcoming && "text-gray-400"
                  )}
                >
                  {s.label}
                </span>
              </div>


            </li>
          );
        })}
      </ol>
    </div>
  );
}