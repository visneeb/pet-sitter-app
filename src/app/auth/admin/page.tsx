"use client";

import { Form } from "@/components/form/index";
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginFields } from "@/components/login/AdminLoginFields";

export default function LoginPage() {
  const { methods, onSubmit, isSubmitting, serverError, serverSuccess } =
    useLoginForm(true);

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[440px]">
        <div className="text-center text-black">
          <h1 className="style-headline-1">Welcome back!</h1>
          <p className="pt-2 text-gray-400 style-headline-3">Admin Panel</p>
        </div>
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
            <LoginFields />
          </Form>
        </div>
      </div>
    </div>
  );
}
