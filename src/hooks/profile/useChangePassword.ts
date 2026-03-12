import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { showCustomToast } from "@/components/ui/toast/Toast";

type FormState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ErrorState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const useChangePassword = () => {
  const [form, setForm] = useState<FormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<ErrorState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextError: ErrorState = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!form.oldPassword.trim()) {
      nextError.oldPassword = "Current password is required.";
    }

    if (!form.newPassword.trim()) {
      nextError.newPassword = "New password is required.";
    } else if (form.newPassword.length < 12) {
      nextError.newPassword = "Password must be at least 12 characters.";
    }

    if (!form.confirmPassword.trim()) {
      nextError.confirmPassword = "Please confirm your new password.";
    } else if (form.newPassword !== form.confirmPassword) {
      nextError.confirmPassword = "Passwords do not match.";
    }

    setError(nextError);

    return !Object.values(nextError).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await authApi.resetPassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      showCustomToast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
        variant: "success",
      });

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setError({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to change password";

      if (
        typeof message === "string" &&
        (message.toLowerCase().includes("current password") ||
          message.toLowerCase().includes("old password") ||
          message.toLowerCase().includes("incorrect"))
      ) {
        setError((prev) => ({
          ...prev,
          oldPassword: "Current password is incorrect.",
        }));
        return;
      }

      showCustomToast({
        title: "Error",
        description: message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
};