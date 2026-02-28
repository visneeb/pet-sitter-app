"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { validateLogin } from "@/lib/validations/loginFormValidation";
import { LoginFormValues } from "@/types/authType";
import { authService } from "@/services/authService";

type AxiosLikeError = {
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
};

export function useLoginForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const methods = useForm<LoginFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validateLogin),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    setError,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    setServerSuccess("");

    try {
      // Use backend API for login
      const session = await authService.login(data.email, data.password);

      if (!session?.user?.email) {
        setServerError("Login succeeded but user data not found.");
        return;
      }

      setServerSuccess("Login successful. Redirecting...");
      setTimeout(() => router.push("/"), 800);
    } catch (err: unknown) {
      const e = err as AxiosLikeError;
      const message = e.message || "Invalid email or password";

      setServerError(message);
      setValue("password", "");
      setFocus("password");

      // Set field-specific errors if the error message indicates the field
      if (message.toLowerCase().includes("email")) {
        setError("email", { type: "server", message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { type: "server", message });
      }
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    serverError,
    serverSuccess,
  };
}
