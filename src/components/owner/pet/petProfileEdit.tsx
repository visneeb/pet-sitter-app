"use client";

// TODO: Define proper pet form values interface
interface PetFormValues {
  name?: string;
  type?: string;
  breed?: string;
  age?: number;
  // Add other pet fields as needed
}

interface Props {
  petId?: string;
  defaultValues?: PetFormValues;
  mode: "create" | "edit";
}

export function PetProfileEdit({ petId, mode }: Props) {
  const isEdit = !!petId;

  const handleSubmit = async () => {
    // TODO: Implement these functions
    if (mode === "edit") {
      // await updatePet(/* ... */);
      console.log("Update pet:", petId);
    } else {
      // await createPet(/* ... */);
      console.log("Create new pet");
    }
  };

  return (
    <button onClick={handleSubmit}>
      {isEdit ? "Update Pet" : "Create Pet"}
    </button>
  );
}
