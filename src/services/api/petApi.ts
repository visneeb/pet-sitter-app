import { privateApi } from "./client";
import type { PetFormValues } from "@/types/pet";

export type PetRequestBody = {
  petName: string;
  petTypeId: number;
  sex: "Male" | "Female" | "Unknown";
  breed: string;
  dateOfBirth: string;
  color: string;
  weight: number;
  about?: string;
};

export type PetResponse = {
  message: string;
};

function toRequestBody(values: PetFormValues): PetRequestBody {
  return {
    petName: values.petName.trim(),
    petTypeId: Number(values.petTypeId),
    sex: values.sex as PetRequestBody["sex"],
    breed: values.breed.trim(),
    dateOfBirth: values.dateOfBirth
      ? values.dateOfBirth.toISOString().slice(0, 10)
      : "",
    color: values.color.trim(),
    weight: Number(values.weight),
    about: values.about?.trim() || "",
  };
}

export const petApi = {
  getTypes: async (): Promise<{ id: number; petType: string }[]> => {
    const { data } = await privateApi.get<{ id: number; petType: string }[]>(
      "/pet/type",
    );
    return data;
  },

  createPet: async (values: PetFormValues): Promise<PetResponse> => {
    const { img_url } = values;

    if (!(img_url instanceof File)) {
      throw new Error("Pet image file is required.");
    }

    const payload = toRequestBody(values);

    const formData = new FormData();
    formData.append("image", img_url);
    formData.append("body", JSON.stringify(payload));

    const { data } = await privateApi.post<PetResponse>(
      "/pet-owner/pet",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },

  updatePet: async (
    petId: number | string,
    values: PetFormValues,
  ): Promise<PetResponse> => {
    const { img_url } = values;

    const payload = toRequestBody(values);

    const formData = new FormData();

    // image is optional on update – only send if new file is chosen
    if (img_url instanceof File) {
      formData.append("image", img_url);
    }

    formData.append("body", JSON.stringify(payload));

    const { data } = await privateApi.put<PetResponse>(
      `/pet-owner/pet/${petId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },
};
