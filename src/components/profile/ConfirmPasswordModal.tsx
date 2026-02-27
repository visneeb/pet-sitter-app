"use client";

import { FormProvider } from "react-hook-form";
import { useChangeEmail } from "@/hooks/useChangeEmail";
import { RHFInput } from "@/components/form/RHFInput";

interface Props {
  newEmail: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export function ConfirmPasswordModal({ newEmail, onSuccess, onClose }: Props) {
  const { methods, onSubmit, isSubmitting, isSuccess } = useChangeEmail({
    newEmail,
    onSuccess,
    onClose,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your password to change email to{" "}
              <span className="font-medium text-gray-700">{newEmail}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Success */}
        {isSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Confirmation emails sent to both addresses. Please confirm to
            complete the change.
          </div>
        )}

        {/* Server error */}
        {errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        {/* Form */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <RHFInput
              name="password"
              label="Current Password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
