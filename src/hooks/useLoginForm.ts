// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { createResolver } from "@/lib/form/createResolver";
// import { validateLogin } from "@/lib/validations/loginFormValidation";
// import { LoginFormValues } from "@/types/authType";
// import { authService } from "@/services/authService";


// type AxiosLikeError = {
//   message?: string;
//   response?: {
//     status?: number;
//     data?: any;
//   };
// };

// const ROLE_REDIRECT: Record<string, string> = {
//   admin: "/admin",
//   sitter: "/sitter/dashboard",
//   owner: "/",
// };

// export function useLoginForm() {
//   const router = useRouter();

//   const [serverError, setServerError] = useState("");
//   const [serverSuccess, setServerSuccess] = useState("");

//   const methods = useForm<LoginFormValues>({
//     mode: "onSubmit",
//     resolver: createResolver(validateLogin),
//     defaultValues: {
//       email: "",
//       password: "",
//       remember: false,
//     },
//   });

//   const {
//     setError,
//     setValue,
//     setFocus,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = async (data: LoginFormValues) => {
//     setServerError("");
//     setServerSuccess("");

//     try {
//       const session = await authService.login(data.email, data.password);

//       if (!session?.user?.email) {
//         setServerError("Login succeeded but user data not found.");
//         return;
//       }

//       const role = String(session?.user?.role ?? "").toLowerCase();

//       const redirectTo = ROLE_REDIRECT[role] ?? "/";

//       setServerSuccess("Login successful. Redirecting...");

//       setTimeout(() => router.push(redirectTo), 800);
//     } catch (err: unknown) {
//       const e = err as AxiosLikeError;
//       const message = e.message || "Invalid email or password";

//       setServerError(message);
//       setValue("password", "");
//       setFocus("password");

//       if (message.toLowerCase().includes("email")) {
//         setError("email", { type: "server", message });
//       } else if (message.toLowerCase().includes("password")) {
//         setError("password", { type: "server", message });
//       }
//     }
//   };

//   return {
//     methods,
//     onSubmit,
//     isSubmitting,
//     serverError,
//     serverSuccess,
//   };
// }

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
      console.log("login response:", response);

      const token = response.accessToken;

      if (!token) {
        setServerError("Login succeeded but session could not be established.");
        return;
      }

      // ✅ เก็บ token หลัง login สำเร็จ
      localStorage.setItem("accessToken", token);

      // ✅ ดึง current user จริงจาก AuthContext
      const currentUser = await refreshUser();
      console.log("refreshUser response:", currentUser);

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