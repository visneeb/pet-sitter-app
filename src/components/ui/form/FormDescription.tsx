"use client";

import { useFormField } from "./FormField";
import cn from "@/utils/cn";
import { FormDescriptionProps } from "@/types/formType";

export function FormDescription({ children, className }: FormDescriptionProps) {
  const { descriptionId, error } = useFormField();

  if (!children || error) return null;

  return (
    <p
      id={descriptionId}
      className={cn("style-body-3 text-gray-500", className)}
    >
      {children}
    </p>
  );
}
