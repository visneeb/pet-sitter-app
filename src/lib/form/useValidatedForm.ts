import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { createResolver, ValidateFn } from "./createResolver";

export function useValidatedForm<T extends FieldValues>(
  validate: ValidateFn<T>,
  options?: UseFormProps<T>,
) {
  return useForm<T>({
    mode: "onSubmit",
    ...options,
    resolver: createResolver(validate),
  });
}
