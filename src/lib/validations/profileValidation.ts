import { FieldErrors } from "react-hook-form";

export type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
};

export function validateProfile(
  data: ProfileFormValues,
): FieldErrors<ProfileFormValues> {
  const errors: FieldErrors<ProfileFormValues> = {};

  if (!data.name.trim()) {
    errors.name = { type: "required", message: "Name is required" };
  }

  if (!data.email.trim()) {
    errors.email = { type: "required", message: "Email is required" };
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = { type: "pattern", message: "Invalid email format" };
  }

  if (!data.phone.trim()) {
    errors.phone = { type: "required", message: "Phone is required" };
  } else if (!/^\d+$/.test(data.phone)) {
    errors.phone = { type: "pattern", message: "Phone number must be numeric" };
  }

  return errors;
}
