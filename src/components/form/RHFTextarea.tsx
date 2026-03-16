"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { FormMessage } from "../ui/form/FormMessage";
import { FormDescription } from "../ui/form/FormDescription";
import { Textarea } from "../ui/input/CustomTextarea";
import { FormLabel } from "../ui/form/FormLabel";

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
    trigger,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField name={name} disabled={props.disabled}>
      <FormLabel>
        {label}
        {required && <span>*</span>}
      </FormLabel>

      <FormControl>
        <Textarea
          id={label}
          {...register(name, {
            required: required ? `${label} is required` : false,
            onChange: () => {
              // Trigger form validation to update dirty state
              trigger(name);
            },
          })}
          {...props}
        />
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormField>
  );
}
