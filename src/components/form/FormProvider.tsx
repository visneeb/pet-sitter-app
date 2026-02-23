"use client";

import { FormProvider as RHFProvider, UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profileValidation";

type Props = {
  methods: UseFormReturn<ProfileFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  children: React.ReactNode;
};

export function FormProvider({ methods, onSubmit, children }: Props) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </RHFProvider>
  );
}
