"use client";

import { FieldValues, Path, useFormContext, Controller } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { FormMessage } from "../ui/form/FormMessage";
import { FormDescription } from "../ui/form/FormDescription";
import { Select } from "../ui/input/Select";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  placeholder?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof Select>,
  "value" | "onChange" | "children"
>;

export function RHFSelect<T extends FieldValues>({
  name,
  label,
  required,
  description,
  children,
  placeholder,
  ...props
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormField error={!!error} name={name}>
          <label className="style-label text-black">
            {label}
            {required && <span>*</span>}
          </label>

          <FormControl>
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              hasError={!!error}
              {...props}
            >
              {children}
            </Select>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormField>
      )}
    />
  );
}
