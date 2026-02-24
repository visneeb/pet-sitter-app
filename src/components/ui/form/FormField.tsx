"use client";

import * as React from "react";
import cn from "@/utils/cn";

type FormFieldContextType = {
  id: string;
  error?: boolean;
  disabled?: boolean;
};

const FormFieldContext = React.createContext<FormFieldContextType | null>(null);

export function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("Form components must be used inside <FormField>");
  }
  return context;
}

type Props = {
  error?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ error, disabled, children, className }: Props) {
  const id = React.useId();

  return (
    <FormFieldContext.Provider value={{ id, error, disabled }}>
      <div className={cn("w-full space-y-1", className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}
