"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { Role, RegisterFormValues } from "@/types/authType";
import { validateRegister } from "@/lib/validations/registerFormValidation";
import { authApi } from "@/services/api/auth";

// Hook

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
      const errData = err?.response?.data;

      if (errData?.field === "email") {
        setError("email", { type: "server", message: errData.message });
      } else if (errData?.field === "phone") {
        setError("phone", { type: "server", message: errData.message });
      } else {
        setServerError(errData?.message || err?.message || "Register failed");
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
