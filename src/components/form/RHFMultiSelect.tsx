"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { MultiSelect, MultiSelectOption } from "../ui/inputs/MultiSelect";
import { FormField } from "../ui/form/FormField";
import { FormLabel } from "../ui/form/FormLabel";
import { FormMessage } from "../ui/form/FormMessage";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
};

export function RHFMultiSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField error={!!error}>
      <FormLabel>{label}</FormLabel>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MultiSelect
            options={options}
            value={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />

      <FormMessage>{error?.message as string}</FormMessage>
    </FormField>
  );
}
