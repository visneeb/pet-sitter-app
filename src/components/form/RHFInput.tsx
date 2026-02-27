"use client";

import { FieldValues, Path, useFormContext, get } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { Input, InputProps } from "../ui/input/Input";
import { FormLabel } from "../ui/form/FormLabel";
import { FormDescription } from "../ui/form/FormDescription";
import { FormMessage } from "../ui/form/FormMessage";

export type RHFInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: React.ReactNode;
  required?: boolean;
  description?: string;
} & Omit<InputProps, "name">;

export function RHFInput<T extends FieldValues>({
  name,
  label,
  required,
  description,
  ...props
}: RHFInputProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);
  const errorMessage = error?.message?.toString();

  return (
    <FormField
      name={name}
      error={!!error}
      errorMessage={errorMessage}
      disabled={props.disabled}
    >
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl>
        <Input
          {...register(name)}
          {...props}
          autoComplete="on"
          error={!!error}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
