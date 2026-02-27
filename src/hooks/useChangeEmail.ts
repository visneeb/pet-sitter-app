"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";

type ConfirmPasswordValues = {
  password: string;
};

interface Options {
  newEmail: string;
  onSuccess?: () => void;
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
      // Re-authenticate with current password first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Current user:", user);

      if (!user?.email) {
        setError("password", { type: "server", message: "User not found." });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.password,
      });
      console.log("Sign in result:", { signInError });

      if (signInError) {
        setError("password", {
          type: "server",
          message: "Incorrect password.",
        });
        return;
      }

      // Password confirmed — update email
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });
      console.log("Email update result:", { updateError });

      if (updateError) {
        setError("password", { type: "server", message: updateError.message });
        return;
      }

      setIsSuccess(true);
      methods.reset();
      setTimeout(() => onSuccess?.(), 2000);
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("password", {
        type: "server",
        message: "An unexpected error occurred.",
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
