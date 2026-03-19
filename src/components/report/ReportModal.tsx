"use client";

import { useEffect, useState } from "react";
import { BaseModal } from "../review/BaseModal";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/input/CustomTextarea";
import { ActionButton } from "@/components/ui/Button";
import { reportApi } from "@/services/api/reportApi";
import cn from "@/utils/cn";
import { CloseIcon } from "@/assets/icons/components";

type ReportModalProps = {
  open: boolean;
  bookingId: number;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

export default function ReportModal({
  open,
  bookingId,
  onClose,
  onSuccess,
  className,
}: ReportModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setSubject("");
      setDescription("");
      setError("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setError("Please enter subject");
      return;
    }

    if (!description.trim()) {
      setError("Please enter description");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError("");

      await reportApi.createReport({
        booking_id: bookingId,
        issue: subject.trim(),
        description: description.trim(),
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <BaseModal open={open} onClose={onClose}>
      <div
          className ="max-h-[800px]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 px-10 py-6 sm:px-10 sm:py-6">
          <h2 className="style-headline-4 text-gray-600 sm:style-headline-3">
            Report
          </h2>

          <button onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-10 px-6 py-6 sm:px-10 sm:py-6 h-full">
          <div>
            <label className="sm:style-body-2 text-gray-700">
              Issue
            </label>

            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              parentClassName="mt-1"
              error={!!error && !subject}
            />
          </div>

          <div>
            <label className="sm:style-body-2 text-gray-700">
              Description
            </label>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detail..."
              rows={5}
              className="mt-1 min-h-[120px]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-10 sm:px-10 sm:py-14 flex justify-between ">
          <ActionButton
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </ActionButton>

          <ActionButton
            variant="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !subject.trim() ||
              !description.trim()
            }
          >
            {isSubmitting ? "Sending..." : "Send Report"}
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}