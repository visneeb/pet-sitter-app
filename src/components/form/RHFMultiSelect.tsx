"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { MultiSelect, MultiSelectOption } from "../ui/input/MultiSelect";
import { get } from "react-hook-form";
import { FormLabel } from "../ui/form/FormLabel";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  description?: string;
  options: { value: number | string; label: string }[];
  placeholder?: string;
  convertToNumbers?: boolean;
};

export function RHFMultiSelect<T extends FieldValues>({
  name,
  label,
  required,
  description,
  options,
  placeholder,
  convertToNumbers,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);

  // Convert options to MultiSelectOption format
  const multiSelectOptions: MultiSelectOption[] = options.map((option) => ({
    label: option.label,
    value: option.value.toString(),
  }));

  // Convert field value to strings for MultiSelect
  const getStringValue = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v) => v.toString());
    }
    return [];
  };

  // Convert selected strings back to numbers if needed
  const handleOnChange = (selectedStrings: string[]) => {
    if (convertToNumbers) {
      return selectedStrings.map((s) => parseInt(s, 10));
    }
    return selectedStrings;
  };

  return (
    <FormField name={name}>
      {label && (
        <FormLabel>
          {label}
          {required && <span>*</span>}
        </FormLabel>
      )}

      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field }) => (
          <MultiSelect
            options={multiSelectOptions}
            value={getStringValue(field.value)}
            onChange={(value) => field.onChange(handleOnChange(value))}
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
