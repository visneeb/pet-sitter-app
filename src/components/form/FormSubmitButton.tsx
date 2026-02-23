"use client";

import { useFormContext } from "react-hook-form";
import { ActionButton } from "../ui/Button";

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
};

export function SubmitButton({ children, isLoading }: Props) {
  const {
    formState: { isSubmitting, isValidating },
  } = useFormContext();

  const loading = isLoading || isSubmitting;
  const disabled = loading || isValidating;

  return (
    <ActionButton type="submit" variant="primary" disabled={disabled}>
      {loading ? "Updating..." : children}
    </ActionButton>
  );
}
