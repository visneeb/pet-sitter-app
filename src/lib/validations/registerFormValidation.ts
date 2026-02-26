import { FieldErrors } from "react-hook-form";
import { RegisterFormValues } from "@/types/authType";

// Field-level rules

function isEmailValid(email: string) {
  const v = email.trim().toLowerCase();
  return v.includes("@") && v.endsWith(".com");
}

function isPhoneValid(phone: string) {
  return /^0\d{9}$/.test(phone);
}

function isPasswordValid(password: string) {
  return password.length > 12;
}

// Helper — wraps a plain message into the FieldError shape

function err(message: string) {
  return { type: "manual", message } as const;
}

// Validator — signature expected by createResolver

export function validateRegister(
  values: RegisterFormValues,
): FieldErrors<RegisterFormValues> {
  const errors: FieldErrors<RegisterFormValues> = {};

  // email
  if (!values.email.trim()) {
    errors.email = err("Please enter your email.");
  } else if (!isEmailValid(values.email)) {
    errors.email = err("Email must contain @ and end with .com");
  }

  // phone
  if (!values.phone.trim()) {
    errors.phone = err("Please enter your phone number.");
  } else if (!isPhoneValid(values.phone)) {
    errors.phone = err("Phone must start with 0 and be 10 digits.");
  }

  // password
  if (!values.password) {
    errors.password = err("Please enter your password.");
  } else if (!isPasswordValid(values.password)) {
    errors.password = err("Password must be longer than 12 characters.");
  }

  return errors;
}
