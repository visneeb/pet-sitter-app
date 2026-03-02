"use client";

import * as React from "react";
import { useFormState } from "react-hook-form";
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
  // useFormState subscribes directly to RHF's internal store
  const { isValid, isDirty, isSubmitting, isValidating } = useFormState();

  const loading = isLoading || isSubmitting;
  const effectiveDirty = isDirty || extraDirty;

  const disabled =
    disabledProp === true ||
    loading ||
    isValidating ||
    (requireValid && !isValid) ||
    (requireDirty && !effectiveDirty);

  return (
    <ActionButton
      type="submit"
      variant="primary"
      disabled={disabled}
      aria-busy={loading}
      className={className}
    >
      {loading ? loadingText : children}
    </ActionButton>
  );
}