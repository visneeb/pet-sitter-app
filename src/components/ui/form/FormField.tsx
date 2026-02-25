"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { FormFieldContextType, FormFieldProviderProps } from "@/types/formType";

const FormFieldContext = React.createContext<FormFieldContextType | null>(null);

export function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("Form components must be used inside <FormField>");
  }
  return context;
}

export function FormField({
  name,
  error,
  errorMessage,
  disabled,
  children,
  className,
}: FormFieldProviderProps) {
  const baseId = name ?? "field";

  const value = React.useMemo(
    () => ({
      name,
      inputId: `${baseId}-input`,
      descriptionId: `${baseId}-description`,
      messageId: `${baseId}-message`,
      error,
      errorMessage,
      disabled,
    }),
    [name, baseId, error, errorMessage, disabled],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <div className={cn("w-full space-y-1", className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}
