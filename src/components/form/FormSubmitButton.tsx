"use client";

import { useFormState } from "react-hook-form";
import { ActionButton } from "../ui/Button";
import { useMemo } from "react";

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
  const { isValid, isDirty, isSubmitting, isValidating } = useFormState();

  const buttonState = useMemo(() => {
    const loading = isLoading || isSubmitting;
    const effectiveDirty = isDirty || extraDirty;

    const disabled =
      disabledProp === true ||
      loading ||
      isValidating ||
      (requireValid && !isValid) ||
      (requireDirty && !effectiveDirty);

    return { loading, disabled };
  }, [
    isLoading,
    isSubmitting,
    isDirty,
    extraDirty,
    disabledProp,
    isValidating,
    requireValid,
    isValid,
    requireDirty,
  ]);

  return (
    <ActionButton
      type="submit"
      variant="primary"
      disabled={buttonState.disabled}
      aria-busy={buttonState.loading}
      className={className}
    >
      {buttonState.loading ? loadingText : children}
    </ActionButton>
  );
}
