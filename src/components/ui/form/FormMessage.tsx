"use client";

import { useFormField } from "./FormField";
import cn from "@/utils/cn";

export function FormMessage({ className }: { className?: string }) {
  const { messageId, error, errorMessage } = useFormField();

  if (!error && !errorMessage) return null;

  return (
    <p id={messageId} className={cn("style-body-3 text-red", className)}>
      {errorMessage}
    </p>
  );
}
