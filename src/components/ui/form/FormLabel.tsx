"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { useFormField } from "./FormField";

export function FormLabel({
  children,
  className,
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { id, disabled } = useFormField();

  return (
    <label
      htmlFor={id}
      className={cn(
        "block style-label transition-colors",
        disabled && "text-gray-400 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </label>
  );
}
