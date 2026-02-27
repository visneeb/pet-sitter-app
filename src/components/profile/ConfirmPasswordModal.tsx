"use client";

import { FormProvider } from "react-hook-form";
import { useChangeEmail } from "@/hooks/useChangeEmail";
import { ActionButton } from "../ui/Button";
import { PasswordInput } from "@/components/form/index";

interface Props {
  newEmail: string;
  onSuccess?: (password?: string) => void;
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
            <h2 className="style-headline-4 text-gray-900">Confirm Password</h2>
            <p className="style-body-2 text-gray-500 mt-1">
              Enter your password to change email to{" "}
              <span className="style-body-2 text-gray-600">{newEmail}</span>
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
            Confirmation emails sent to new email address. Please confirm to
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
            <PasswordInput
              name="password"
              label="Current Password"
              placeholder="Enter your password"
              error={errors.password?.message}
            />

            <div className="flex justify-around px-5 w-full">
              <ActionButton variant="ghost" onClick={onClose}>
                Cancel
              </ActionButton>
              <ActionButton
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirming..." : "Confirm"}
              </ActionButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
