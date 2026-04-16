"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { userApi } from "@/services/api/user";
import { buildFormData } from "@/lib/utils/formData";

// Temporary local function in case of module resolution issues
function localBuildFormData(
  bodyJson: object,
  file?: File | null,
  removeProfileImg?: boolean,
): FormData {
  const formData = new FormData();
  formData.append("body", JSON.stringify(bodyJson));
  if (file) {
    formData.append("image", file);
  }
  if (removeProfileImg) {
    formData.append("removeProfileImg", "true");
  }
  return formData;
}

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
      // Get current user data from backend API
      const currentUser = await userApi.getCurrentUser();

      if (!currentUser) {
        setError("password", {
          type: "server",
          message: "No active session",
        });
        return;
      }

      // Update email using backend API
      const formData = localBuildFormData({
        name: currentUser.name,
        phone: currentUser.phone,
        email: newEmail,
        password: data.password,
      });

      const result = await userApi.updateProfile(formData);

      methods.reset();
      setTimeout(() => {
        setIsSuccess(true);
        onSuccess?.(data.password);
      }, 0);
    } catch (error: any) {
      console.error("Email update error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage = error.response?.data?.error || error.message || "";

      // Handle specific password mismatch error
      if (
        error.response?.status === 401 ||
        errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        (errorMessage.toLowerCase().includes("invalid") &&
          !errorMessage.toLowerCase().includes("email"))
      ) {
        setError("password", {
          type: "server",
          message: "Password does not match",
        });
      } else {
        setError("password", {
          type: "server",
          message: errorMessage,
        });
      }
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
