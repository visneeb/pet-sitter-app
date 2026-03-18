"use client";

import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";
import cn from "@/utils/cn";
import { FormFieldContextType } from "@/types/formType";

const FormFieldContext = React.createContext<FormFieldContextType | null>(null);

export function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("Form components must be used inside <FormField>");
  }
  return context;
}

type Props = {
  name: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

type InnerProps = {
  name: string;
  disabled?: boolean;
  children: React.ReactNode;
};

function FormFieldInner({ name, disabled, children }: InnerProps) {
  const { control } = useFormContext();

  const { errors } = useFormState({ control, name });

  const fieldError = errors[name];

  const value = React.useMemo<FormFieldContextType>(
    () => ({
      name,
      inputId: `${name}-input`,
      descriptionId: `${name}-description`,
      messageId: `${name}-message`,
      error: !!fieldError,
      errorMessage: fieldError?.message as string | undefined,
      disabled,
    }),
    [name, fieldError, disabled],
  );

  return (
    <FormFieldContext.Provider value={value}>
      {children}
    </FormFieldContext.Provider>
  );
}

export function FormField({ name, disabled, children, className }: Props) {
  return (
    <div className={cn("w-full space-y-1", className)}>
      <FormFieldInner name={name} disabled={disabled}>
        {children}
      </FormFieldInner>
    </div>
  );
}
