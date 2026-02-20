import React from "react";

export type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
