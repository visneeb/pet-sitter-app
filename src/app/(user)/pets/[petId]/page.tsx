"use client";

import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePetForm } from "@/hooks/usePetForm";
import { Form } from "@/components/form";
import PetFields from "@/components/owner/pet/petFields";
import { useParams } from "next/navigation";
import Loading from "@/components/common/loading/loading";

export default function EditPetPage() {
  const params = useParams<{ petId: string }>();
  const petId = params.petId;

  const { petTypes, methods, handleSubmit, isSubmitting, isLoading } =
    usePetForm({
      mode: "edit",
      petId,
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
      {isLoading ? (
        <Loading />
      ) : (
        <Form methods={methods} onSubmit={handleSubmit} disabled={isSubmitting}>
          <PetFields mode="edit" petTypes={petTypes} />
        </Form>
      )}
    </>
  );
}
