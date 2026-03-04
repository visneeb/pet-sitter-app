"use client";

import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Form } from "@/components/form";
import { usePetForm } from "@/hooks/usePetForm";
import PetFields from "@/components/owner/pet/petFields";

export default function CreatePetPage() {
  const { methods, handleSubmit, isSubmitting } = usePetForm({
    mode: "create",
  });

  return (
    <>
      <UserProfileHeader
        title="Your Pets"
        leftAction={
          <Link href="/pets">
            <ChevronLeft />
          </Link>
        }
      />
      <Form methods={methods} onSubmit={handleSubmit} disabled={isSubmitting}>
        <PetFields mode="create" />
      </Form>
    </>
  );
}
