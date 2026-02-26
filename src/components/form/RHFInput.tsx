"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { Input, InputProps } from "../ui/input/Input";
import { FormLabel } from "../ui/form/FormLabel";
import { FormDescription } from "../ui/form/FormDescription";
import { FormMessage } from "../ui/form/FormMessage";
import { get } from "react-hook-form";

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
  console.log("FIELD:", name);
  console.log("ERRORS:", errors);
  console.log("THIS FIELD ERROR:", error);
  return (
    <FormField
      error={!!error}
      errorMessage={errorMessage}
      disabled={props.disabled}
      name={name}
    >
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl>
        <Input
          {...register(name, {
            required: required ? "This field is required" : false,
          })}
          {...props}
          error={!!error}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
