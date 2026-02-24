"use client";

import * as React from "react";
import {
  FormProvider as RHFProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import cn from "@/utils/cn";

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  children,
  className,
  id,
}: Props<T>) {
  return (
    <RHFProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className={cn("flex flex-col gap-6", className)}
      >
        {children}
      </form>
    </RHFProvider>
  );
}
