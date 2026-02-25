"use client";

import { FieldValues, Path, useFormContext, get } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { Password } from "../ui/input/Password";
import { FormLabel } from "../ui/form/FormLabel";
import { FormDescription } from "../ui/form/FormDescription";
import { FormMessage } from "../ui/form/FormMessage";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
} & React.ComponentPropsWithoutRef<"input">;

export function RHFPassword<T extends FieldValues>({
  name,
  label,
  required,
  description,
  error,
  ...props
}: Props<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <FormField error={!!error} errorMessage={error} name={name}>
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl noErrorIcon>
        <Password
          hasError={!!error}
          {...register(name, {
            required: required ? "Password is required" : false,
          })}
          {...props}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
