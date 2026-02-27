"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { FormMessage } from "../ui/form/FormMessage";
import { FormDescription } from "../ui/form/FormDescription";
import { FormLabel } from "../ui/form/FormLabel";
import { Textarea } from "../ui/input/CustomTextarea";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
} & React.ComponentPropsWithoutRef<"textarea">;

export function RHFTextarea<T extends FieldValues>({
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

  const error = errors[name];

  return (
    <FormField name={name} error={!!error}>
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl>
        <Textarea
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          {...props}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
