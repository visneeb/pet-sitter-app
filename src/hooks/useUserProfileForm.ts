"use client";

import { useForm } from "react-hook-form";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";

export function useProfileForm() {
  const methods = useForm<ProfileFormValues>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    clearErrors();

    const allErrors: Partial<Record<keyof ProfileFormValues, string>> = {};

    // Client validation
    const validationErrors = validateProfile(data);
    Object.assign(allErrors, validationErrors);

    // Call server only if email has no client error
    if (!validationErrors.email) {
      try {
        await fakeApiCall(data);
      } catch (err: any) {
        allErrors.email = err.message;
      }
    }

    if (Object.keys(allErrors).length > 0) {
      Object.entries(allErrors).forEach(([field, message]) => {
        setError(field as keyof ProfileFormValues, {
          type: "manual",
          message: message as string,
        });
      });
      return;
    }

    alert("Profile updated successfully!");
  });

  return {
    methods,
    onSubmit,
    isSubmitting,
  };
}

async function fakeApiCall(data: ProfileFormValues) {
  await new Promise((r) => setTimeout(r, 1500));

  const email = data.email.trim().toLowerCase();

  if (email === "taken@email.com") {
    throw new Error("Email already exists");
  }

  return true;
}
