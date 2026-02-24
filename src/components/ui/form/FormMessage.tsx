"use client";

import { useFormField } from "./FormField";

export function FormMessage({ children }: { children?: React.ReactNode }) {
  const { error } = useFormField();

  if (!error || !children) return null;

  return <p className="text-red style-body-3">{children}</p>;
}
