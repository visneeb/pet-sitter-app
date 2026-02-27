"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { userApi } from "@/services/api/userApi";

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
    console.log("Submitting password confirmation:", data);

    if (!data.password.trim()) {
      setError("password", {
        type: "required",
        message: "Password is required.",
      });
      return;
    }

    try {
      // Get current user data from backend API
      const currentUser = await userApi.getCurrentUser();

      if (!currentUser) {
        setError("password", {
          type: "server",
          message: "No active session",
        });
        return;
      }

      console.log("Current user:", currentUser);
      console.log("Updating email from:", currentUser.email, "to:", newEmail);

      // Update email using backend API
      const result = await userApi.updateProfile({
        name: currentUser.name,
        phone: currentUser.phone,
        email: newEmail,
        password: data.password,
      });

      console.log("Email update response:", result);

      console.log("Email update successful");
      setIsSuccess(true);
      methods.reset();
      setTimeout(() => onSuccess?.(data.password), 2000);
    } catch (error: any) {
      console.error("Email update error:", error);
      console.error("Error response:", error.response?.data);

      setError("password", {
        type: "server",
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to update email",
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
