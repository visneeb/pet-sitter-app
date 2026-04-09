"use client";

import React from "react";
import { ActionButton } from "@/components/ui/Button";

type Props = {
  onBack: () => void;
  onNext: () => void;
  canNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  className?: string;
};

export function BookingStepFooterMobile({
  onBack,
  onNext,
  canNext = true,
  backLabel = "Back",
  nextLabel = "Next",
  className = "",
}: Props) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden ${className}`}
    >
      <div className="mx-auto max-w-screen-sm">
        <div className="grid grid-cols-2 gap-3">
          <ActionButton variant="secondary" onClick={onBack}>
            {backLabel}
          </ActionButton>

          <ActionButton variant="primary" disabled={!canNext} onClick={onNext}>
            {nextLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

