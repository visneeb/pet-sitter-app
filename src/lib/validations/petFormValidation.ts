import { FieldErrors } from "react-hook-form";
import type { PetFormValues } from "@/types/pet";
import { validateImage } from "@/lib/validations/useImageValidation";
import type { ImageFile } from "@/types/imageUploadType";

export function validatePetForm(
  values: PetFormValues,
): FieldErrors<PetFormValues> {
  const errors: FieldErrors<PetFormValues> = {};

  const rawImage = values.img_url;
  const hasUrl = typeof rawImage === "string" && rawImage.trim().length > 0;
  const hasFile = rawImage instanceof File;

  if (!hasUrl && !hasFile) {
    errors.img_url = {
      type: "required",
      message: "Pet image is required.",
    };
  } else if (hasFile) {
    const imageValidation = validateImage(rawImage as ImageFile);
    if (imageValidation !== true) {
      errors.img_url = {
        type: "manual",
        message: imageValidation,
      };
    }
  }

  if (!values.petName?.trim()) {
    errors.petName = {
      type: "required",
      message: "Pet name is required.",
    };
  }

  if (!values.petTypeId?.toString().trim()) {
    errors.petTypeId = {
      type: "required",
      message: "Pet type is required.",
    };
  }

  if (!values.breed?.trim()) {
    errors.breed = {
      type: "required",
      message: "Breed is required.",
    };
  }

  if (!values.sex?.trim()) {
    errors.sex = {
      type: "required",
      message: "Sex is required.",
    };
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = {
      type: "required",
      message: "Date of birth is required.",
    };
  } else if (values.dateOfBirth > new Date()) {
    errors.dateOfBirth = {
      type: "validate",
      message: "Date of birth cannot be in the future.",
    };
  }

  if (!values.color?.trim()) {
    errors.color = {
      type: "required",
      message: "Color is required.",
    };
  }

  if (!values.weight?.toString().trim()) {
    errors.weight = {
      type: "required",
      message: "Weight is required.",
    };
  } else {
    const parsedWeight = Number(values.weight);
    if (Number.isNaN(parsedWeight) || parsedWeight <= 0) {
      errors.weight = {
        type: "validate",
        message: "Weight must be a positive number.",
      };
    } else if (parsedWeight > 1000) {
      errors.weight = {
        type: "validate",
        message: "Weight must be less than 1000.",
      };
    } else if (String(parsedWeight).split(".")[1].length > 2) {
      errors.weight = {
        type: "validate",
        message: "Weight must be less than 2 decimal places.",
      };
    }
  }

  return errors;
}
