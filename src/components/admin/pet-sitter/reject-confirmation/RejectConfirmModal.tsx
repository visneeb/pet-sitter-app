"use client";

import { useForm, FormProvider } from "react-hook-form";
import { BaseModal } from "@/components/review/BaseModal";
import { CloseIcon } from "@/assets/icons/components";
import { ActionButton } from "@/components/ui/Button";
import { RejectComment } from "./RejectComment";
import { useRejectSitter } from "@/hooks/admin/useRejectSitter";

interface RejectFormValues {
  adminNote: string;
}

interface RejectConfirmModalProps {
  open: boolean;
  onClose: () => void;
  sitterId: number;
  hasPendingUpdate: boolean;
  onSuccess?: () => void;
}

export function RejectConfirmModal({
  open,
  onClose,
  sitterId,
  hasPendingUpdate,
  onSuccess,
}: RejectConfirmModalProps) {
  const methods = useForm<RejectFormValues>({
    defaultValues: { adminNote: "" },
    mode: "onBlur",
    shouldUnregister: false,
  });

  const { reject, isLoading } = useRejectSitter({
    sitterId,
    hasPendingUpdate,
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await reject(data);
    } catch {
      methods.setError("adminNote", {
        type: "server",
        message: "Failed to reject sitter. Please try again.",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <BaseModal open={open} onClose={onClose} className="h-100 w-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 md:px-10 px-4 py-6 shrink-0">
          <h2
            id="reject-confirm-modal"
            className="style-headline-3 text-gray-600"
          >
            Reject Confirmation
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 transition hover:text-gray-400 hover:cursor-pointer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <RejectComment />

        <div className="flex justify-between px-6 py-4 shrink-0">
          <ActionButton
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </ActionButton>
        </div>
      </BaseModal>
    </FormProvider>
  );
}
