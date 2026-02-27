"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { ActionButton } from "../ui/Button";

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  requireValid?: boolean;
  requireDirty?: boolean;
};

export function SubmitButton({
  children,
  isLoading,
  loadingText = "Submitting...",
  disabled: disabledProp,
  className,
  requireValid = false,
  requireDirty = false,
}: Props) {
  const form = useFormContext();

  const isSubmitting = form?.formState?.isSubmitting ?? false;
  const isValidating = form?.formState?.isValidating ?? false;
  const isValid = form?.formState?.isValid ?? true;
  const isDirty = form?.formState?.isDirty ?? true;

  const loading = isLoading || isSubmitting;
  const disabled =
    (disabledProp ?? loading) ||
    isValidating ||
    (requireValid && !isValid) ||
    (requireDirty && !isDirty);

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
