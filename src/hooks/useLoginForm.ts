"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { validateLogin } from "@/lib/validations/loginFormValidation";
import { LoginFormValues } from "@/types/authType";
import { authApi } from "@/services/api/auth";
import { useAuth } from "@/contexts/AuthContext";

function isValidRedirect(redirect: string | null): boolean {
  if (!redirect) return false;
  return redirect.startsWith("/") && !redirect.startsWith("//");
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

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
      const response = await authApi.login(data);
      const token = response.accessToken;

      if (!token) {
        setServerError("Login succeeded but session could not be established.");
        return;
      }

      setServerSuccess("Login successful. Redirecting...");
      await refreshUser();
      const redirect = searchParams.get("redirect");
      const target =
        redirect && isValidRedirect(redirect) ? redirect : "/";
      setTimeout(() => router.push(target), 800);
    } catch (err: any) {
      const message = err.message || "Invalid email or password";

      setServerError(message);
      setValue("password", "");
      setFocus("password");

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
