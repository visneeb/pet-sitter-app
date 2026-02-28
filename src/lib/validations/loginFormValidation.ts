// import { LoginFormValues } from "@/types/authType";

// export function validateLogin(values: LoginFormValues) {
//   const errors: Partial<Record<keyof LoginFormValues, string>> = {};

//   const email = values.email?.trim();
//   const password = values.password ?? "";

//   if (!email) errors.email = "Please enter your email.";
//   else if (!email.includes("@")) errors.email = "Email must contain @";

//   if (!password) errors.password = "Please enter your password.";

//   return errors;
// }

import { FieldErrors } from "react-hook-form";
import { LoginFormValues } from "@/types/authType";

// ─── Helper ───────────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function err(message: string) {
  return { type: "manual", message } as const;
}

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateLogin(
  values: LoginFormValues,
): FieldErrors<LoginFormValues> {
  const errors: FieldErrors<LoginFormValues> = {};

  const email = values.email?.trim();
  const password = values.password ?? "";

  if (!email) {
    errors.email = err("Please enter your email.");
  } else if (!emailRegex.test(email)) {
    errors.email = err("Please enter a valid email address.");
  }

  if (!password) {
    errors.password = err("Please enter your password.")  }

    return errors;
  }