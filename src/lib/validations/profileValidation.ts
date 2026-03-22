import { FieldErrors } from "react-hook-form";

export type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  dateOfBirth: Date | null;
  profile_img_url?: string;
  password?: string;
  avatarFile?: File;
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
  } else if (!/^\d{10}$/.test(data.phone) || !data.phone.startsWith("0")) {
    errors.phone = {
      type: "pattern",
      message: "Phone must start with 0 and be 10 digits.",
    };
  }

  if (data.idNumber && !/^\d{13}$/.test(data.idNumber)) {
    errors.idNumber = {
      type: "pattern",
      message: "ID number must be 13 digits",
    };
  }

  if (data.dateOfBirth) {
    if (data.dateOfBirth > new Date()) {
      errors.dateOfBirth = {
        type: "validate",
        message: "Date of birth cannot be in the future",
      };
    }
  }

  return errors;
}
