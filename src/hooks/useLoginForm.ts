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
import { authService } from "@/services/authService";

type AxiosLikeError = {
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
};

const ROLE_REDIRECT: Record<string, string> = {
  admin: "/admin",
  sitter: "/sitter/dashboard",
  owner: "/",
};

const normalizeRole = (role: unknown) => String(role ?? "").trim().toLowerCase();

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
      const session = await authService.login(data.email, data.password);

      if (!session?.user?.email) {
        setServerError("Login succeeded but user data not found.");
        return;
      }

      // 1) role จาก login response ก่อน
      let role = normalizeRole(session?.user?.role);

      // 2) ถ้า role ไม่มา → fallback ไป getUser()
      if (!role) {
        const me = await authService.getUser();
        role = normalizeRole((me as any)?.role);
      }

      // ✅ ช่วย debug ว่า role ได้ค่าอะไรจริง (เปิดดูใน Console)
      console.log("LOGIN ROLE:", role, "SESSION:", session);

      const redirectTo = ROLE_REDIRECT[role] ?? "/";

      setServerSuccess("Login successful. Redirecting...");
      router.push(redirectTo);
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