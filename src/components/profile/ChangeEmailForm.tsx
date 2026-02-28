"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useChangeEmail } from "@/hooks/useChangeEmail";
import { RHFInput } from "@/components/form/RHFInput";
import { useForm } from "react-hook-form";

interface Props {
  onSuccess?: () => void;
}

type EmailFormValues = {
  newEmail: string;
  confirmEmail: string;
};

export function ChangeEmailForm({ onSuccess }: Props) {
  const [currentNewEmail, setCurrentNewEmail] = useState<string>("");

  const emailMethods = useForm<EmailFormValues>({
    mode: "onSubmit",
    defaultValues: { newEmail: "", confirmEmail: "" },
  });

  const { methods, onSubmit, isSubmitting, isSuccess } = useChangeEmail({
    newEmail: currentNewEmail,
    onSuccess: () => {
      emailMethods.reset();
      onSuccess?.();
    },
  });

  const { handleSubmit: handleEmailSubmit, watch } = emailMethods;

  const watchedNewEmail = watch("newEmail");

  const handleFormSubmit = (data: EmailFormValues) => {
    if (data.newEmail !== data.confirmEmail) {
      emailMethods.setError("confirmEmail", {
        type: "manual",
        message: "Emails do not match",
      });
      return;
    }
    setCurrentNewEmail(data.newEmail);
    // Call the password confirmation form submission
    methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      {/* Email entry form */}
      <FormProvider {...emailMethods}>
        <form
          onSubmit={handleEmailSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          {isSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              Confirmation emails sent. Please confirm both old and new address
              to complete the change.
            </div>
          )}

          {emailMethods.formState.errors.root && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {emailMethods.formState.errors.root.message}
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

      {/* Password confirmation form (hidden, triggered programmatically) */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="hidden">
          <RHFInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </form>
      </FormProvider>
    </>
  );
}
