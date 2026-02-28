const isEdit = !!petId;

<button>
  {isEdit ? "Update Pet" : "Create Pet"}
</button>


interface Props {
  defaultValues?: PetFormValues;
  mode: "create" | "edit";
}


if (mode === "edit") {
  await updatePet(...)
} else {
  await createPet(...)
}