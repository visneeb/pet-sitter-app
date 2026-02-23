"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profileValidation";
import { Input } from "../ui/Input";

type Props = {
  name: keyof ProfileFormValues;
  label: string;
  type?: string;
  helperText?: string;
  required?: boolean;
};

export function RHFInput({
  name,
  label,
  type = "text",
  helperText,
  required = false,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="style-label">
        {label}
        {required && <span>*</span>}
      </label>

      <Input
        id={name}
        type={type}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={
          error ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
        {...register(name)}
      />

      {error && (
        <p id={`${name}-error`} className="style-body-3 text-red">
          {error.message}
        </p>
      )}

      {helperText && !error && (
        <p id={`${name}-helper`} className="style-body-3 text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
