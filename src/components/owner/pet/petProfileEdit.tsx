"use client";

import { ActionButton } from "@/components/ui/Button";
import type { PetFormValues } from "@/types/pet";

interface Props {
  petId?: string;
  defaultValues?: PetFormValues;
  mode: "create" | "edit";
  className?: string;
}

export function PetProfileEdit({ petId, className }: Props) {
  const isEdit = !!petId;

  return (
    <ActionButton variant="primary" type="submit" className={className}>
      {isEdit ? "Update Pet" : "Create Pet"}
    </ActionButton>
  );
}
