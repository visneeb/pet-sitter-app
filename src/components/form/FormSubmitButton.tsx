"use client";

import { useFormState, useFormContext } from "react-hook-form";
import { ActionButton } from "../ui/Button";

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  requireValid?: boolean;
  requireDirty?: boolean;
  extraDirty?: boolean;
};

export function SubmitButton({
  children,
  isLoading,
  loadingText = "Submitting...",
  disabled: disabledProp,
  className,
  requireValid = false,
  requireDirty = false,
  extraDirty = false,
}: Props) {
  const { control } = useFormContext();

  const { isValid, isDirty, isSubmitting, isValidating } = useFormState({
    control,
  });

  const loading = isLoading || isSubmitting;
  const effectiveDirty = isDirty || extraDirty;
  const isDisabled =
    disabledProp === true ||
    loading ||
    isValidating ||
    (requireValid && !isValid) ||
    (requireDirty && !effectiveDirty);

  return (
    <ActionButton
      type="submit"
      variant="primary"
      disabled={isDisabled}
      aria-busy={loading}
      className={className}
    >
      {loading ? loadingText : children}
    </ActionButton>
  );
}
