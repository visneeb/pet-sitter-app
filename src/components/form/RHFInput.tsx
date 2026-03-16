"use client";

import { FieldValues, Path, useFormContext, Controller } from "react-hook-form";
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
  value?: string;
} & Omit<InputProps, "name">;

export function RHFInput<T extends FieldValues>({
  name,
  label,
  required,
  description,
  value,
  ...props
}: RHFInputProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <FormField name={name} disabled={props.disabled}>
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl>
        <Controller
          name={name}
          control={control}
          render={(
            { field, fieldState: { error } },
          ) => (
            <>
              <Input
                {...field}
                {...props}
                value={value || field.value}
                onChange={(e) => {
                  field.onChange(e);
                  props.onChange?.(e);
                }}
                autoComplete="on"
              />
            </>
          )}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
