"use client";

import type { PetFormValues } from "@/types/pet";
import { useForm } from "react-hook-form";
import { createResolver } from "@/lib/form/createResolver";
import { validatePetForm } from "@/lib/validations/petFormValidation";
import { petApi } from "@/services/api";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { useRouter } from "next/navigation";

interface Props {
  mode: "create" | "edit";
  petId?: number | string;
  defaultValues?: Partial<PetFormValues>;
}

export function usePetForm(props: Props) {
  const router = useRouter();
  const methods = useForm<PetFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validatePetForm),
    defaultValues: {
      img_url: null,
      petName: "",
      petTypeId: "",
      breed: "",
      sex: "",
      dateOfBirth: null,
      color: "",
      weight: "",
      about: "",
      ...props.defaultValues,
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const handleSubmit = async (data: PetFormValues) => {
    console.log(5555);

    try {
      if (props.mode === "create") {
        const response = await petApi.createPet(data);

        showCustomToast({
          title: "Pet created successfully",
          description: response.message ?? "Your pet has been created.",
          variant: "success",
        });

        router.push("/pets");
      } else {
        if (!props.petId) {
          throw new Error("Pet ID is required for updating pet.");
        }

        const response = await petApi.updatePet(props.petId, data);

        showCustomToast({
          title: "Pet updated successfully",
          description: response.message ?? "Your pet has been updated.",
          variant: "success",
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        (props.mode === "create"
          ? "Failed to create pet"
          : "Failed to update pet");

      showCustomToast({
        title:
          props.mode === "create"
            ? "Failed to create pet"
            : "Failed to update pet",
        description: message,
        variant: "error",
      });

      throw error;
    }
  };

  return { methods, handleSubmit, isSubmitting };
}
