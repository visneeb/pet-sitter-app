"use client";

import { FormProvider } from "react-hook-form";
import { useChangeEmail } from "@/hooks/useChangeEmail";
import { RHFInput } from "@/components/form/RHFInput";

interface Props {
  onSuccess?: () => void;
}

export function ChangeEmailForm({ onSuccess }: Props) {
  const { methods, onSubmit, isSubmitting, isSuccess } = useChangeEmail({
    onSuccess,
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {isSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ✅ Confirmation emails sent. Please confirm both old and new address
            to complete the change.
          </div>
        )}

        {errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        <RHFInput
          name="newEmail"
          label="New Email"
          type="email"
          placeholder="new@example.com"
        />

        <RHFInput
          name="confirmEmail"
          label="Confirm New Email"
          type="email"
          placeholder="new@example.com"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Sending confirmation..." : "Confirm New Email"}
        </button>
      </form>
    </FormProvider>
  );
}
