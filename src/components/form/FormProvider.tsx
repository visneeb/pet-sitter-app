"use client";

import {
  FormProvider as RHFProvider,
  UseFormReturn,
  FieldValues,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  children,
  disabled,
  className,
}: Props<T>) {
  return (
    <RHFProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className={className}
      >
        <fieldset disabled={disabled} className="contents">
          {children}
        </fieldset>
      </form>
    </RHFProvider>
  );
}
