"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormProvider } from "@/components/form/FormProvider";
import { Input, SubmitButton } from "@/components/form/index";
import { ConfirmPasswordModal } from "@/components/profile/ConfirmPasswordModal";
import { authApi } from "@/services/api/auth";
import { showCustomToast } from "@/components/ui/toast/Toast";

export default function ChangeEmailForm() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const methods = useForm({
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const { isSubmitting } = methods.formState;

  const onSubmit = () =>
    methods.handleSubmit((data) => {
      setPendingEmail(data.email);
      setShowPasswordModal(true);
    })();

  const onEmailConfirmed = async (password?: string) => {
    if (!password) return;
    setIsUpdating(true);
    try {
      const result = await authApi.updateEmail(pendingEmail, password);
      if (result.error) throw new Error(result.error);

      showCustomToast({
        title: "Email updated successfully",
        description: "Your email has been changed.",
        variant: "success",
      });

      setShowPasswordModal(false);
      methods.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update email";
      methods.setError("email", { type: "server", message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={onSubmit}
        disabled={isSubmitting || isUpdating}
      >
        <div className="flex flex-col gap-15">
          <div className="space-y-10">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton
              isLoading={isSubmitting || isUpdating}
              requireValid={true}
              requireDirty={true}
            >
              Change Email
            </SubmitButton>
          </div>
        </div>
      </FormProvider>

      {showPasswordModal && pendingEmail && (
        <ConfirmPasswordModal
          newEmail={pendingEmail}
          onSuccess={onEmailConfirmed}
          onClose={() => {
            setShowPasswordModal(false);
            setIsUpdating(false);
          }}
        />
      )}
    </>
  );
}
