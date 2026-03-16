"use client";

import { Form } from "@/components/form";
import { usePetForm } from "@/hooks/usePetForm";

import PetFields from "@/components/owner/pet/petFields";
import { ActionButton } from "@/components/ui/Button";

type Props = {
  onSuccess?: () => void; // ให้ modal ปิดหลังสร้างสำเร็จ
};

export function CreatePetFormContent({ onSuccess }: Props) {
  const { petTypes, methods, handleSubmit, isSubmitting } = usePetForm({
    mode: "create",
  });

  // ถ้า usePetForm ของคุณรองรับ callback จะดีที่สุด
  // ถ้ายังไม่รองรับ ให้เรียก onSuccess หลัง submit สำเร็จใน hook
  const onSubmit = async (data: any) => {
    await handleSubmit(data);
    onSuccess?.();
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} disabled={isSubmitting}>
      <PetFields mode="create" petTypes={petTypes} />

      <div className="mt-6 flex justify-end">
        <ActionButton variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </ActionButton>
      </div>
    </Form>
  );
}