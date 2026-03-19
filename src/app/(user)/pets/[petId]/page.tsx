"use client";

import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePetForm } from "@/hooks/usePetForm";
import { Form } from "@/components/form";
import PetFields from "@/components/owner/pet/petFields";
import { useParams } from "next/navigation";
import Loading from "@/components/common/loading/loading";
import Modal from "@/components/ui/Modal";

export default function EditPetPage() {
  const params = useParams<{ petId: string }>();
  const petId = params.petId;
  const {
    petTypes,
    methods,
    handleSubmit,
    handleDeletePet,
    isSubmitting,
    isLoading,
    isModalLoading,
  } = usePetForm({
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
        <>
          <Form
            methods={methods}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          >
            <PetFields mode="edit" petTypes={petTypes} showCancel={true} />
          </Form>
          <Modal
            id="delete-pet"
            title="Delete Confirmation"
            massage="Are you sure to delete this pet?"
            cancelText="Cancel"
            confirmText="Delete"
            onConfirm={handleDeletePet}
            disabled={isModalLoading}
          />
        </>
      )}
    </>
  );
}
