import { FieldErrors, FieldValues, Resolver } from "react-hook-form";

export type ValidateFn<T extends FieldValues> = (
  values: T,
) => FieldErrors<T> | Promise<FieldErrors<T>>;

export function createResolver<T extends FieldValues>(
  validate: ValidateFn<T>,
): Resolver<T> {
  return async (values) => {
    const typedValues = values as T;
    const errors = await validate(typedValues);

    if (Object.keys(errors).length > 0) {
      return {
        values: typedValues as unknown as Record<string, never>,
        errors,
      };
    }

    return {
      values: typedValues,
      errors: {},
    };
  };
}
