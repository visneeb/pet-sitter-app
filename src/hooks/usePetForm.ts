"use client";

import type { PetFormValues } from "@/types/pet";
import { useForm } from "react-hook-form";
import { createResolver } from "@/lib/form/createResolver";
import { validatePetForm } from "@/lib/validations/petFormValidation";
import { petApi } from "@/services/api";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PetDetail } from "@/services/api/petApi";

interface Props {
  mode: "create" | "edit";
  petId?: number | string;
  defaultValues?: Partial<PetFormValues>;
  redirectOnSuccess?: boolean;
}

export function usePetForm(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(props.mode === "edit");
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [petTypes, setPetTypes] = useState<{ id: number; name: string }[]>([]);
  const [pet, setPet] = useState<PetDetail | null>(null);
  const hasInitialised = useRef(false);
  const params = useParams<{ petId: string }>();
  const router = useRouter();
  const methods = useForm<PetFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validatePetForm),
    defaultValues: {
      img_url: null,
      petName: "",
      petTypeId: undefined,
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

  const loadPetTypes = async () => {
    setPetTypes(await petApi.getTypes());
  };

  const loadPet = async () => {
    if (props.mode !== "edit" || !props.petId) return;

    try {
      setPet(await petApi.getById(props.petId));
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load pet data";

      showCustomToast({
        title: "Failed to load pet",
        description: message,
        variant: "error",
      });

      router.push("/pets");
    }
  };

  useEffect(() => {
    loadPetTypes();
  }, []);

  useEffect(() => {
    loadPet();
  }, [props.mode, props.petId, methods]);

  useEffect(() => {
    if (!pet || hasInitialised.current) return;
    setIsLoading(true);

    if (pet) {
      methods.reset({
        img_url: pet.imgUrl || null,
        petName: pet.petName,
        petTypeId: petTypes.filter((petType) => petType.name === pet.petType)[0]
          ?.id,
        sex: pet.sex,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth) : null,
        color: pet.color,
        weight: String(pet.weight),
        about: pet.about ?? undefined,
      });

      setIsLoading(false);
    }

    hasInitialised.current = true;
  }, [pet, methods]);

  const handleSubmit = async (data: PetFormValues) => {
    console.log(data);

    try {
      if (props.mode === "create") {
        await petApi.createPet(data);

        showCustomToast({
          title: "Pet created successfully",
          description: "Your pet has been created.",
          variant: "success",
        });

        router.push("/pets");
      } else {
        if (!props.petId) {
          throw new Error("Pet ID is required for updating pet.");
        }

        await petApi.updatePet(props.petId, data);

        showCustomToast({
          title: "Pet updated successfully",
          description: "Your pet has been updated.",
          variant: "success",
        });

        router.push("/pets");
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

  const handleDeletePet = async () => {
    if (!params?.petId) return;

    setIsModalLoading(true);
    try {
      await petApi.deletePet(params.petId);

      showCustomToast({
        title: "Pet deleted successfully",
        description: "Your pet has been deleted.",
        variant: "success",
      });

      router.push("/pets");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete pet";

      showCustomToast({
        title: "Failed to delete pet",
        description: message,
        variant: "error",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  return {
    petTypes,
    methods,
    handleSubmit,
    handleDeletePet,
    isSubmitting,
    isLoading,
    isModalLoading,
  };
}