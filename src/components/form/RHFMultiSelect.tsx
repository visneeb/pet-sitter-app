"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { MultiSelect, MultiSelectOption } from "../ui/input/MultiSelect";
import { get } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
  options: MultiSelectOption[];
  placeholder?: string;
};

export function RHFMultiSelect<T extends FieldValues>({
  name,
  label,
  required,
  description,
  options,
  placeholder,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);

  return (
    <FormField error={!!error} name={name}>
      {label && (
        <label className="style-label text-black">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field }) => (
          <MultiSelect
            options={options}
            value={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
            hasError={!!error}
          />
        )}
      />

      {description && !error && (
        <p className="style-body-3 text-gray-500">{description}</p>
      )}

      {error && (
        <p className="style-body-3 text-red">{error.message as string}</p>
      )}
    </FormField>
  );
}
