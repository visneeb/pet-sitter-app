"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Textarea } from "../ui/inputs/Textarea";
import { FormField } from "../ui/form/FormField";
import { FormLabel } from "../ui/form/FormLabel";
import { FormMessage } from "../ui/form/FormMessage";
import { FormControl } from "../ui/form/FormControl";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export function RHFTextarea<T extends FieldValues>({
  name,
  label,
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
        <Textarea {...register(name)} />
      </FormControl>

      <FormMessage>{error?.message as string}</FormMessage>
    </FormField>
  );
}