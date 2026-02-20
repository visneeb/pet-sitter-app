"use client";

import { useState } from "react";
import Link from "next/link";
import { Paw } from "@/decorations/Paw";
import { QuadrantEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";
import facebookIcon from "@/assets/icons/fb.svg";
import gmailIcon from "@/assets/icons/gg.svg";




type Role = "customer" | "sitter";

type FormValues = {
  email: string;
  phone: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function isEmailValid(email: string) {
  const v = email.trim().toLowerCase();
  return v.includes("@") && v.endsWith(".com");
}

function isPhoneValid(phone: string) {
  return /^0\d{9}$/.test(phone);
}

function isPasswordValid(password: string) {
  return password.length > 8;
}

// mock uniqueness
const usedEmailsMock = new Set(["test@company.com", "abc@demo.com"]);
const usedPhonesMock = new Set(["0123456789", "0999999999"]);

async function checkEmailUnique(email: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 150));
  return !usedEmailsMock.has(email.trim().toLowerCase());
}

async function checkPhoneUnique(phone: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 150));
  return !usedPhonesMock.has(phone.trim());
}

function ErrorIcon() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold"
    >
      !
    </span>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("customer");

  const [values, setValues] = useState<FormValues>({
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof FormValues>(key: K, value: string) {
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

    if (!v.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!isPhoneValid(v.phone)) next.phone = "Phone must start with 0 and be 10 digits.";

    if (!v.password) next.password = "Please enter your password.";
    else if (!isPasswordValid(v.password)) next.password = "Password must be longer than 8 characters.";

    return next;
  }

  async function validateAsyncUniqueness(v: FormValues): Promise<FormErrors> {
    const next: FormErrors = {};

    if (v.email.trim() && isEmailValid(v.email)) {
      const unique = await checkEmailUnique(v.email);
      if (!unique) next.email = "This email is already registered.";
    }

    if (v.phone.trim() && isPhoneValid(v.phone)) {
      const unique = await checkPhoneUnique(v.phone);
      if (!unique) next.phone = "This phone number is already registered.";
    }

    return next;
  }

  function inputClass(field: keyof FormValues) {
    // ✅ ยึดสัดส่วนเดิมของคุณ: px-4 py-3 text-sm
    // ✅ เพิ่ม pr-12 เผื่อไอคอน error
    const base =
      "mt-1 w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none focus:ring-4";
    const ok = "border-gray-200 focus:border-orange-500 focus:ring-orange-100";
    const bad = "border-red-500 focus:border-red-500 focus:ring-red-100";
    const showError = Boolean(touched[field] && errors[field]);
    return `${base} ${showError ? bad : ok}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // mark all touched
    setTouched({ email: true, phone: true, password: true });

    // sync
    const syncErrors = validateSync(values);
    if (Object.keys(syncErrors).length > 0) {
      setErrors(syncErrors);
      setIsSubmitting(false);
      return;
    }

    // uniqueness
    const uniqueErrors = await validateAsyncUniqueness(values);
    if (Object.keys(uniqueErrors).length > 0) {
      setErrors(uniqueErrors);
      setIsSubmitting(false);
      return;
    }

    // ✅ mock success
    setIsSubmitting(false);
    // TODO: call real API
  }

  const emailHasError = Boolean(touched.email && errors.email);
  const phoneHasError = Boolean(touched.phone && errors.phone);
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
            <h1 className="style-headline-1 text-[var(--color-black)]">Join Us!</h1>
            <p className="mt-2 text-gray-400 font-bold">
              Find your perfect pet sitter with us
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mt-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                  role === "customer"
                    ? "bg-white shadow text-orange-600"
                    : "text-gray-500"
                }`}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => setRole("sitter")}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                  role === "sitter"
                    ? "bg-white shadow text-orange-600"
                    : "text-gray-500"
                }`}
              >
                Sitter
              </button>
            </div>
          </div>

          {/* Card */}
          {/* ✅ คงสัดส่วนเดิม: mt-8 p-6 */}
          <div className="mt-8 item-center">
            <form className="space-y-5" onSubmit={onSubmit}>
              <input type="hidden" value={role} readOnly />

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <div className="relative">
                  <input
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    type="email"
                    placeholder="email@company.com"
                    className={inputClass("email")}
                  />
                  {emailHasError && <ErrorIcon />}
                </div>
                {emailHasError && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-700">Phone</label>
                <div className="relative">
                  <input
                    value={values.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setField("phone", digitsOnly);
                    }}
                    onBlur={() => markTouched("phone")}
                    type="tel"
                    placeholder="Your phone number"
                    className={inputClass("phone")}
                    inputMode="numeric"
                  />
                  {phoneHasError && <ErrorIcon />}
                </div>
                {phoneHasError && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <input
                    value={values.password}
                    onChange={(e) => setField("password", e.target.value)}
                    onBlur={() => markTouched("password")}
                    type="password"
                    placeholder="Create your password"
                    className={inputClass("password")}
                  />
                  {passwordHasError && <ErrorIcon />}
                </div>
                {passwordHasError && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Register button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-orange-500 py-3 text-[var(--color-white)] style-button hover:bg-orange-600 transition disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isSubmitting
                  ? "Creating account..."
                  : `Register as ${role === "customer" ? "Customer" : "Sitter"}`}
              </button>

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

              {/* Login link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-orange-500 style-body-2 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
