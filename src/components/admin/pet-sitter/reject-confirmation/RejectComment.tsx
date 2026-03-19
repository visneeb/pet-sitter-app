"use client";

import { RHFTextarea } from "@/components/form/RHFTextarea";

export function RejectComment() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <RHFTextarea
        name="adminNote"
        label="Reason and suggestion"
        required
        rows={5}
      />
    </div>
  );
}