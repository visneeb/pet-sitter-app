"use client";

import { useForm } from "react-hook-form";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";
import { createResolver } from "@/lib/form/createResolver";

export function useUserProfileForm() {
  const methods = useForm<ProfileFormValues>({
    mode: "onSubmit",
    resolver: createResolver(validateProfile),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      profile_image: "",
    },
  });

  const {
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await fakeApiCall(data);
      alert("Profile updated successfully!");
    } catch (err: any) {
      setError("email", {
        type: "server",
        message: err.message,
      });
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
  };
}
async function fakeApiCall(data: ProfileFormValues) {
  await new Promise((r) => setTimeout(r, 1500));

  const email = data.email?.trim().toLowerCase() ?? "";

  if (email === "taken@email.com") {
    throw new Error("Email already exists");
  }

  return true;
}
