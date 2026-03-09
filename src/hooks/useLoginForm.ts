"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createResolver } from "@/lib/form/createResolver";
import { validateLogin } from "@/lib/validations/loginFormValidation";
import { LoginFormValues } from "@/types/authType";
import { authApi } from "@/services/api/auth";
import { useAuth } from "@/contexts/AuthContext";

export function useLoginForm() {
  const router = useRouter();
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
        return "/admin";
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
        setServerError("Login succeeded, but user profile could not be loaded.");
        return;
      }

      setServerSuccess("Login successful. Redirecting...");

      // ✅ redirect ตาม role จริงของ app
      const redirectPath = getRedirectPathByRole(currentUser.role);
      router.push(redirectPath);
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