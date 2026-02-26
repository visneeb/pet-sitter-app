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
};

export function SubmitButton({
  children,
  isLoading,
  loadingText = "Submitting...",
  disabled: disabledProp,
  className,
}: Props) {
  const form = useFormContext();

  const isSubmitting = form?.formState?.isSubmitting ?? false;
  const isValidating = form?.formState?.isValidating ?? false;

  const loading = isLoading || isSubmitting;
  const disabled = (disabledProp ?? loading) || isValidating;

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
