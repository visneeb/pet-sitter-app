"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authApi } from "@/services/api/auth";

type ConfirmPasswordValues = {
  password: string;
};

interface Options {
  newEmail: string;
  onSuccess?: (password?: string) => void;
  onClose?: () => void;
}

export function useChangeEmail({ newEmail, onSuccess, onClose }: Options) {
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<ConfirmPasswordValues>({
    mode: "onSubmit",
    defaultValues: { password: "" },
  });

  const {
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ConfirmPasswordValues) => {
    if (!data.password.trim()) {
      setError("password", {
        type: "required",
        message: "Password is required.",
      });
      return;
    }

    try {
      // FIX: Use PATCH /api/auth/change-email which works for all roles
      const result = await authApi.updateEmail(newEmail, data.password);

      if (result.error) {
        // Handle password mismatch or other API errors
        const errorMessage = result.error.toLowerCase();
        if (
          errorMessage.includes("password") ||
          errorMessage.includes("incorrect") ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("unauthorized")
        ) {
          setError("password", {
            type: "server",
            message: "Password does not match",
          });
        } else {
          setError("password", {
            type: "server",
            message: result.error,
          });
        }
        return;
      }

      methods.reset();
      setIsSuccess(true);
      onSuccess?.(data.password);
    } catch (error: any) {
      console.error("Email update error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update email";
      setError("password", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    isSuccess,
    onClose,
  };
}
