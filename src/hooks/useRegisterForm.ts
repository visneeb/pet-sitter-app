"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { Role, RegisterFormValues } from "@/types/authType";
import { validateRegister } from "@/lib/validations/registerFormValidation";
import { authApi } from "@/services/api/auth";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const methods = useForm<RegisterFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validateRegister),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });

  const {
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    setServerSuccess("");

    try {
      const res = await authApi.register({ ...data, role });

      setServerSuccess(
        res.message || "User registered successfully. Redirecting...",
      );
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      const message: string =
        err?.response?.data?.error || err?.message || "Register failed";

      if (message.toLowerCase().includes("phone")) {
        setError("phone", { type: "server", message });
      } else if (message.toLowerCase().includes("email")) {
        setError("email", { type: "server", message });
      } else {
        setServerError(message);
      }
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    role,
    setRole,
    serverError,
    serverSuccess,
  };
}