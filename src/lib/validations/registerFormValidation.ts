import { FieldErrors } from "react-hook-form";
import { RegisterFormValues } from "@/types/authType";

// Field-level rules

function isEmailValid(email: string) {
  const v = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isPhoneValid(phone: string) {
  return /^0\d{9}$/.test(phone);
}

function isPasswordValid(password: string) {
  return password.length >= 12;
}

// Helper

function err(message: string) {
  return { type: "manual", message } as const;
}

//  Validator

export function validateRegister(
  values: RegisterFormValues,
): FieldErrors<RegisterFormValues> {
  const errors: FieldErrors<RegisterFormValues> = {};

  // email
  if (!values.email?.trim()) {
    errors.email = err("Please enter your email.");
  } else if (!isEmailValid(values.email)) {
    errors.email = err("Please enter a valid email address.");
  }

  // phone
  if (!values.phone?.trim()) {
    errors.phone = err("Please enter your phone number.");
  } else if (!isPhoneValid(values.phone)) {
    errors.phone = err("Phone must start with 0 and be 10 digits.");
  }

  // password
  if (!values.password) {
    errors.password = err("Please enter your password.");
  } else if (!isPasswordValid(values.password)) {
    errors.password = err("Password must be at least 12 characters.");
  }

  return errors;
}
