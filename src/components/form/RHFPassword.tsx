"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Password } from "../ui/inputs/Password";
import { FormField } from "../ui/form/FormField";
import { FormLabel } from "../ui/form/FormLabel";
import { FormMessage } from "../ui/form/FormMessage";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export function RHFPassword<T extends FieldValues>({ name, label }: Props<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField error={!!error}>
      <FormLabel>{label}</FormLabel>

      <Password {...register(name)} />

      <FormMessage>{error?.message as string}</FormMessage>
    </FormField>
  );
}
