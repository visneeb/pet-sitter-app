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
  ...props
}: Props<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);
  const errorMessage = error?.message?.toString();

  return (
    <FormField name={name} disabled={props.disabled}>
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
          autoComplete="new-password"
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
