"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Select } from "../ui/inputs/Select";
import { FormField } from "../ui/form/FormField";
import { FormLabel } from "../ui/form/FormLabel";
import { FormMessage } from "../ui/form/FormMessage";
import { FormControl } from "../ui/form/FormControl";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  children: React.ReactNode;
};

export function RHFSelect<T extends FieldValues>({
  name,
  label,
  children,
}: Props<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField error={!!error}>
      <FormLabel>{label}</FormLabel>

      <FormControl asChild>
        <Select {...register(name)}>{children}</Select>
      </FormControl>

      <FormMessage>{error?.message as string}</FormMessage>
    </FormField>
  );
}
