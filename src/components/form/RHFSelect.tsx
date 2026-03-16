"use client";

import { FieldValues, Path, useFormContext, Controller } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { FormMessage } from "../ui/form/FormMessage";
import { FormDescription } from "../ui/form/FormDescription";
import { Select } from "../ui/input/Select";
import { FormLabel } from "../ui/form/FormLabel";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  placeholder?: string;
  // ✅ Let caller decide if value should be stored as number
  asNumber?: boolean;
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
  asNumber = false,
  ...props
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormField name={name}>
          <FormLabel>
            {label}
            {required && <span>*</span>}
          </FormLabel>

          <FormControl>
            <Select
              value={
                field.value != null && field.value !== ""
                  ? String(field.value)
                  : ""
              }
              onChange={(val) => {
                if (!val) {
                  field.onChange(asNumber ? 0 : "");
                  return;
                }
                //  asNumber prop or auto-detect: if val parses cleanly as number, store as number
                const asNum = Number(val);
                if (asNumber || (!isNaN(asNum) && val !== "")) {
                  field.onChange(asNum);
                } else {
                  field.onChange(val);
                }
              }}
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
