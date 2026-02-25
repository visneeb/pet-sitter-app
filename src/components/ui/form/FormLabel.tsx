"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { useFormField } from "./FormField";

type Props = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> & {
  children: React.ReactNode;
};
export function FormLabel({ children, className, ...props }: Props) {
  const { inputId, disabled } = useFormField();
  const isDisabled = Boolean(disabled);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "block style-label text-black transition-colors",
        isDisabled && "text-gray-400 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
