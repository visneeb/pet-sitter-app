"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { createResolver } from "@/lib/form/createResolver";
import { validateLogin } from "@/lib/validations/loginFormValidation";
import { LoginFormValues } from "@/types/authType";
import { authApi, LoginResponse } from "@/services/api/auth";

type AxiosLikeError = {
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
};

function pickToken(data: LoginResponse) {
  return data.access_token || data.accessToken || data.token || "";
}

function normalizeServerMessage(data: any): string {
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (Array.isArray(data?.errors) && data.errors[0]?.message) ||
    "Invalid email or password"
  );
}

function normalizeServerField(data: any): string {
  const field =
    data?.field ||
    data?.path ||
    (Array.isArray(data?.errors) && data.errors[0]?.field) ||
    (Array.isArray(data?.errors) && data.errors[0]?.path) ||
    "";
  return String(field).toLowerCase();
}

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
      const res = await authApi.login(data);

      const token = pickToken(res);
      if (!token) {
        setServerError("Login succeeded but token was not returned.");
        // UX: clear + focus password
        setValue("password", "");
        setFocus("password");
        return;
      }

      // remember: true -> localStorage | remember: false -> sessionStorage
      const storage = data.remember ? localStorage : sessionStorage;
      const other = data.remember ? sessionStorage : localStorage;

      storage.setItem("access_token", token);

      if (res.user) {
        storage.setItem("user", JSON.stringify(res.user));
      }

      // clear other storage to avoid stale token/user
      other.removeItem("access_token");
      other.removeItem("user");

      setServerSuccess(res.message || "Login successful. Redirecting...");
      setTimeout(() => router.push("/"), 800);
    } catch (err: unknown) {
      const e = err as AxiosLikeError;
      const errData = e.response?.data;

      // ✅ สร้าง message ที่แน่นอน + ปลอดภัย (ไม่ reveal ว่า email มีจริงไหม)
      const message = "Invalid email or password"

      // ✅ ให้ UI เปลี่ยนแน่นอน: แสดง banner เสมอ
      setServerError(message);

      // ✅ UX: clear + focus password (ชัวร์กว่า resetField กับ custom component)
      setValue("password", "");
      setFocus("password");

      // ✅ ถ้า backend ส่ง field มาด้วยค่อย map ลงช่อง (optional)
      const field = normalizeServerField(errData);

      if (field.includes("email")) {
        setError("email", { type: "server", message });
      } else if (field.includes("password")) {
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