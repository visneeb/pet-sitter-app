"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { validateLogin } from "@/lib/validations/loginFormValidation";
import { LoginFormValues } from "@/types/authType";
import { authApi } from "@/services/api/auth";
import { useAuth } from "@/contexts/AuthContext";

type AxiosLikeError = {
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
};

export function useLoginForm(isAdmin: boolean = false) {
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

  // ✅ helper สำหรับ map role -> path
  const getRedirectPathByRole = (role?: string) => {
    switch (role) {
      case "owner":
        return "/";
      case "sitter":
        return "/petsitter-profile";
      case "admin":
        return "/admin/pet-owner";
      default:
        return "/";
    }
  };

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

      // ✅ เก็บ token หลัง login สำเร็จ
      localStorage.setItem("accessToken", token);

      // ✅ ดึง current user จริงจาก AuthContext
      const currentUser = await refreshUser();

      // ✅ ถ้า profile โหลดไม่ได้ ให้หยุดก่อน
      if (!currentUser) {
        setServerError(
          "Login succeeded, but user profile could not be loaded.",
        );
        return;
      }

      if (isAdmin) {
        // Check if the user is an admin
        if (currentUser?.role !== "admin") {
          localStorage.removeItem("accessToken");
          throw new Error("You are not authorized to access this page");
        }

        setServerSuccess("Login successful. Redirecting...");
        setTimeout(() => router.push("/admin/pet-owner"), 800);
      } else {
        setServerSuccess("Login successful. Redirecting...");

        // ✅ redirect ตาม role จริงของ app
        const redirectPath = getRedirectPathByRole(currentUser.role);
        setTimeout(() => router.push(redirectPath), 800);
      }
    } catch (err: unknown) {
      const e = err as AxiosLikeError;
      const message = e.message || "Invalid email or password";

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
