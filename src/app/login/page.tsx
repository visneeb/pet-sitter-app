// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Paw } from "@/decorations/Paw";
// import { QuadrantEllipse } from "@/decorations/Ellipse";
// import { Star } from "@/decorations/Shapes";
// import facebookIcon from "@/assets/icons/fb.svg";
// import gmailIcon from "@/assets/icons/gg.svg";
// import { Input } from "@/components/ui/input";
// import { ActionButton } from "@/components/ui/Button";
// import { Password } from "@/components/ui/Input/Password";
// import { useRouter } from "next/navigation";
// import { publicApi } from "@/lib/publicApi";




// type FormValues = {
//   email: string;
//   password: string;
//   remember: boolean;
// };

// type FormErrors = Partial<Record<keyof FormValues, string>>;

// function isEmailValid(email: string) {
//   const v = email.trim().toLowerCase();
//   return v.includes("@") && v.endsWith(".com");
// }



// export default function LoginPage() {
//   const router = useRouter();
//   const [values, setValues] = useState<FormValues>({
//     email: "",
//     password: "",
//     remember: false,
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>(
//     {}
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [showPassword, setShowPassword] = useState(false);
//   const [serverError, setServerError] = useState("");
//   const [serverSuccess, setServerSuccess] = useState("");

//   function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
//     setValues((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: undefined }));
//   }

//   function markTouched<K extends keyof FormValues>(key: K) {
//     setTouched((prev) => ({ ...prev, [key]: true }));
//   }

//   function validateSync(v: FormValues): FormErrors {
//     const next: FormErrors = {};

//     if (!v.email.trim()) next.email = "Please enter your email.";
//     else if (!isEmailValid(v.email)) next.email = "Email must contain @ and end with .com";

//     if (!v.password) next.password = "Please enter your password.";

//     return next;
//   }

//   function inputClass(field: "email" | "password") {
//     // สัดส่วนเหมือนหน้า register: px-4 py-3 text-sm + pr-12 เผื่อ icon
//     const base =
//       "mt-1 w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none focus:ring-4";
//     const ok = "border-gray-200 focus:border-orange-500 focus:ring-orange-100";
//     const bad = "border-red-500 focus:border-red-500 focus:ring-red-100";
//     const showError = Boolean(touched[field] && errors[field]);
//     return `${base} ${showError ? bad : ok}`;
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (isSubmitting) return;
  
//     setIsSubmitting(true);
//     setServerError("");
  
//     setTouched({ email: true, password: true, remember: true });
  
//     const syncErrors = validateSync(values);
//     if (Object.keys(syncErrors).length > 0) {
//       setErrors(syncErrors);
//       setIsSubmitting(false);
//       return;
//     }
  
//     try {
//       const payload = {
//         email: values.email.trim(),
//         password: values.password,
//       };
  
//       // ✅ endpoint อาจเป็น /auth/login หรือ /login (ขึ้นกับ backend)
//       const res = await publicApi.post("/auth/login", payload);
  
//       // ✅ รองรับหลายรูปแบบ response ที่พบบ่อย
//       const accessToken =
//         res.data?.access_token || res.data?.accessToken || res.data?.token;
  
//       if (!accessToken) {
//         throw new Error("Login succeeded but token was not returned.");
//       }
  
//       // remember: true -> localStorage (อยู่ยาว)
//       // remember: false -> sessionStorage (ปิดแท็บแล้วหาย)
//       const storage = values.remember ? localStorage : sessionStorage;
//       storage.setItem("access_token", accessToken);
  
//       // (optional) ถ้ามี user object
//       if (res.data?.user) storage.setItem("user", JSON.stringify(res.data.user));
  
//       router.push("/"); // หรือ "/dashboard"
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Login failed";
  
//       setServerError(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const emailHasError = Boolean(touched.email && errors.email);
//   const passwordHasError = Boolean(touched.password && errors.password);

//   return (
//     <main className="relative min-h-screen bg-white overflow-hidden">
//       {/* Decorative layer */}
//       <div className="pointer-events-none absolute inset-0">
//         <Paw
//         aria-hidden="true"
//         className="absolute -right-7 top-10 w-40 md:w-56 lg:w-55 text-yellow-200 rotate-290"
//         />

//         <Star
//           aria-hidden="true"
//           className="absolute -left-22 -bottom-35 w-64 md:w-80 lg:w-96 text-green-500 rotate-35 hidden md:block"
//         />
//         <QuadrantEllipse
          
//           aria-hidden="true"
//           className="absolute left-10 bottom-70 w-32 md:w-40 lg:w-35 text-blue-500 rotate-45 hidden md:block"
//         />

//       </div>

//       {/* Content layer */}
//       <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
//         <div className="w-full max-w-[480px]">
//           {/* Title */}
//           <div className="text-center">
//             <h1 className="style-headline-1 text-[var(--color-black)]">
//               Welcome back!
//             </h1>
//             <p className="mt-2 text-gray-400 font-bold">
//               Find your perfect pet sitter with us
//             </p>
//           </div>

//           {/* Card */}
//           <div className="mt-8 item-center">
//             <form className="space-y-5" onSubmit={onSubmit}>
//               {serverError && (
//                 <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
//                   {serverError}
//                 </div>
//               )}
//               {serverSuccess && (
//                 <div className="p-3 rounded bg-green-50 text-green-700 text-sm">
//                   {serverSuccess}
//                 </div>
//               )}
//               {/* Email */}
//               <div>
//                 <label className="text-sm text-gray-700">Email</label>
//                 <div className="relative">
//                   <Input
//                   type="email"
//                   value={values.email}
//                   onChange={(e) => setField("email", e.target.value)}
//                   onBlur={() => markTouched("email")}
//                   placeholder="email@company.com"
//                   error={emailHasError}
//                   // errorMessage={errors.email}
//                   // className="pr-10"
//                   className={inputClass("email")}
//                 />
               
//               </div>
//               {emailHasError && (
//                 <p className="mt-1 text-xs text-red-600">{errors.email}</p>
//               )}
//             </div>

//               {/* Password */}
//               <div>
//                 <label className="text-sm text-gray-700">Password</label>
//                 <div className="relative">
//                   <Password
//                     value={values.password}
//                     onChange={(e) => setField("password", e.target.value)}
//                     onBlur={() => markTouched("password")}
//                     placeholder="Create your password"
//                     error={passwordHasError}
//                     // errorMessage={errors.password}
//                     className={inputClass("password")}
//                   />
                  
//                 </div>
//                 {passwordHasError && (
//                   <p className="mt-1 text-xs text-red-600">{errors.password}</p>
//                 )}
//               </div>

//               {/* Remember + Forgot */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm text-gray-600">
//                   <input
//                     type="checkbox"
//                     checked={values.remember}
//                     onChange={(e) => setField("remember", e.target.checked)}
//                     className="h-4 w-4 rounded border-gray-300"
//                   />
//                   Remember?
//                 </label>

//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-orange-500 font-semibold hover:underline"
//                 >
//                   Forget Password?
//                 </Link>
//               </div>

//               {/* Login button */}
//               <ActionButton
//                 type="submit"
//                 variant="primary"
//                 disabled={isSubmitting}
//                 className="w-full disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Logging in..." : "Login"}
//               </ActionButton>

//               {/* Divider */}
//               <div className="flex items-center gap-3">
//                 <div className="h-px flex-1 bg-gray-200" />
//                 <span className="text-xs text-gray-400">Or Continue With</span>
//                 <div className="h-px flex-1 bg-gray-200" />
//               </div>

//               {/* Social buttons */}
//               <div className="flex gap-3">
 
//                 <button
//                   type="button"
//                   className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-gray-700 style-body-2 hover:bg-gray-200 transition"
//                 >
//                   <img src={facebookIcon.src} alt="" className="w-5 h-5" />
//                     Facebook
//                 </button>

//                 <button
//                   type="button"
//                   className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-gray-700 style-body-2 hover:bg-gray-200 transition"
//                 >
//                   <img src={gmailIcon.src} alt="" className="w-5 h-5" />
//                     Gmail
//                 </button>

//               </div>

//               {/* Register link */}
//               <p className="text-center text-sm text-gray-600">
//                 Don&apos;t have an account?{" "}
//                 <Link
//                   href="/register"
//                   className="text-orange-500 style-body-2 font-semibold hover:underline"
//                 >
//                   Register
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


import { Paw } from "@/decorations/Paw";
import { QuadrantEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";
import facebookIcon from "@/assets/icons/fb.svg";
import gmailIcon from "@/assets/icons/gg.svg";

import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/ui/Button";
import { Password } from "@/components/ui/Input/Password";

import { publicApi } from "@/lib/publicApi";

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function isEmailValid(email: string) {
  const v = email.trim().toLowerCase();
  return v.includes("@") && v.endsWith(".com");
}

export default function LoginPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>(
    {},
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function markTouched<K extends keyof FormValues>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function validateSync(v: FormValues): FormErrors {
    const next: FormErrors = {};

    if (!v.email.trim()) next.email = "Please enter your email.";
    else if (!isEmailValid(v.email)) next.email = "Email must contain @ and end with .com";

    if (!v.password) next.password = "Please enter your password.";

    return next;
  }

  function inputClass(field: "email" | "password") {
    const base =
      "mt-1 w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none focus:ring-4";
    const ok = "border-gray-200 focus:border-orange-500 focus:ring-orange-100";
    const bad = "border-red-500 focus:border-red-500 focus:ring-red-100";
    const showError = Boolean(touched[field] && errors[field]);
    return `${base} ${showError ? bad : ok}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerError("");
    setServerSuccess("");

    setTouched({ email: true, password: true, remember: true });

    const syncErrors = validateSync(values);
    if (Object.keys(syncErrors).length > 0) {
      setErrors(syncErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        email: values.email.trim(),
        password: values.password,
      };

      // ✅ ถ้า backend ไม่ได้ prefix /auth ให้เปลี่ยนเป็น "/login"
      const res = await publicApi.post("/auth/login", payload);

      const accessToken = res.data?.access_token || res.data?.accessToken || res.data?.token;

      if (!accessToken) {
        throw new Error("Login succeeded but token was not returned.");
      }

      // ✅ ตั้ง success message (ไว้ให้ user เห็นก่อน redirect)
      setServerSuccess("Login successful. Redirecting...");

      // remember: true -> localStorage | remember: false -> sessionStorage
      const storage = values.remember ? localStorage : sessionStorage;
      const other = values.remember ? sessionStorage : localStorage;

      storage.setItem("access_token", accessToken);

      // optional user (ถ้า backend ส่งมา)
      if (res.data?.user) {
        storage.setItem("user", JSON.stringify(res.data.user));
      }

      // ✅ เคลียร์อีกฝั่ง กัน token/user ค้าง
      other.removeItem("access_token");
      other.removeItem("user");

      // ✅ redirect (หน่วงนิดให้เห็น success)
      setTimeout(() => router.push("/"), 800); // หรือ "/dashboard"
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";

      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const emailHasError = Boolean(touched.email && errors.email);
  const passwordHasError = Boolean(touched.password && errors.password);

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative layer */}
      <div className="pointer-events-none absolute inset-0">
        <Paw
          aria-hidden="true"
          className="absolute -right-7 top-10 w-40 md:w-56 lg:w-55 text-yellow-200 rotate-290"
        />

        <Star
          aria-hidden="true"
          className="absolute -left-22 -bottom-35 w-64 md:w-80 lg:w-96 text-green-500 rotate-35 hidden md:block"
        />

        <QuadrantEllipse
          aria-hidden="true"
          className="absolute left-10 bottom-70 w-32 md:w-40 lg:w-35 text-blue-500 rotate-45 hidden md:block"
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-[480px]">
          {/* Title */}
          <div className="text-center">
            <h1 className="style-headline-1 text-[var(--color-black)]">Welcome back!</h1>
            <p className="mt-2 text-gray-400 font-bold">
              Find your perfect pet sitter with us
            </p>
          </div>

          {/* Card */}
          <div className="mt-8 item-center">
            <form className="space-y-5" onSubmit={onSubmit}>
              {/* ✅ Server messages */}
              {serverError && (
                <div className="p-3 rounded bg-red-50 text-red-700 text-sm">{serverError}</div>
              )}
              {serverSuccess && (
                <div className="p-3 rounded bg-green-50 text-green-700 text-sm">
                  {serverSuccess}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="email@company.com"
                    error={emailHasError}
                    className={inputClass("email")}
                  />
                </div>
                {emailHasError && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <Password
                    value={values.password}
                    onChange={(e) => setField("password", e.target.value)}
                    onBlur={() => markTouched("password")}
                    placeholder="Enter your password"
                    error={passwordHasError}
                    className={inputClass("password")}
                  />
                </div>
                {passwordHasError && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={(e) => setField("remember", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Remember?
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-500 font-semibold hover:underline"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Login button */}
              <ActionButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </ActionButton>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">Or Continue With</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Social buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-gray-700 style-body-2 hover:bg-gray-200 transition"
                >
                  <img src={facebookIcon.src} alt="" className="w-5 h-5" />
                  Facebook
                </button>

                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-gray-700 style-body-2 hover:bg-gray-200 transition"
                >
                  <img src={gmailIcon.src} alt="" className="w-5 h-5" />
                  Gmail
                </button>
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-orange-500 style-body-2 font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}