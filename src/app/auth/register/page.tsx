"use client";

import Link from "next/link";

import facebookIcon from "@/assets/icons/fb.svg";
import gmailIcon from "@/assets/icons/gg.svg";
import { Form } from "@/components/form/index";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { RegisterFields } from "@/components/register/Registerfield";
import { Role } from "@/types/authType";

export default function RegisterPage() {
  const {
    methods,
    onSubmit,
    isSubmitting,
    role,
    setRole,
    serverError,
    serverSuccess,
  } = useRegisterForm();

  const roles: { value: Role; label: string }[] = [
    { value: "customer", label: "Customer" },
    { value: "sitter", label: "Sitter" },
  ];

  return (
    <div>
      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          {/* Title */}
          <div className="text-center text-black">
            <h1 className="style-headline-1 ">Join Us!</h1>
            <p className="pt-2 text-gray-400 style-headline-3">
              Find your perfect pet sitter with us
            </p>
          </div>

          {/* Role Toggle */}
          <div className="pt-4">
            <div className="flex w-full bg-gray-100 rounded-full p-1">
              {roles.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                    role === value
                      ? "bg-white shadow text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="w-full pt-8 flex flex-col gap-[32px]">
            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}
            {serverSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                {serverSuccess}
              </div>
            )}

            <Form
              methods={methods}
              onSubmit={onSubmit}
              disabled={isSubmitting}
              className="flex flex-col gap-[32px]"
            >
              <RegisterFields role={role} />
            </Form>

            {/* Divider */}
            <div className="my-4 flex items-center text-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="style-body-1 text-gray-400">
                Or Continue With
              </span>
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
            <p className="text-center style-body-1 text-black">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orange-500 style-body-2 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
