"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { RegisterFormValues } from "@/types/authType";
import { validateRegister } from "@/lib/validations/registerFormValidation";
import { authApi } from "@/services/api/auth";

export function useRegisterForm() {
  const router = useRouter();
  const [serverSuccess, setServerSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const methods = useForm<RegisterFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validateRegister),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      role: "owner",
    },
  });

  const {
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterFormValues) => {
    setServerSuccess("");
    setServerError("");

    try {
      const res = await authApi.register(data);

      setServerSuccess(
        res.message || "User registered successfully. Redirecting...",
      );

      setTimeout(() => router.push("/auth/login"), 1200);
    } catch (err: any) {
      const message = err.message;
      setServerError(message);

      if (message.toLowerCase().includes("phone")) {
        setError("phone", { type: "server", message });
      } else {
        setError("email", { type: "server", message });
      }
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    serverSuccess,
    serverError,
  };
}
