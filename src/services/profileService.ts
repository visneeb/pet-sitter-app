import { userApi } from "./api/user";
import { authApi } from "./api/auth";
import { ProfileFormValues } from "@/lib/validations/profileValidation";
import { ImageFile } from "@/types/imageUploadType";
import { validateImage } from "@/lib/validations/useImageValidation";
import formatLocalDate from "@/utils/formatLocalDate";

// Builds a FormData payload the backend expects:
//    - field "body": stringified JSON with name/phone/email/password etc.
//      (including removeProfileImg when removing avatar)
//    - field "file": the image File (optional)
export function buildFormData(
  bodyJson: object,
  file?: File | null,
  removeProfileImg?: boolean,
): FormData {
  const formData = new FormData();
  const requestBody = removeProfileImg
    ? { ...bodyJson, removeProfileImg: true }
    : bodyJson;
  formData.append("body", JSON.stringify(requestBody));
  if (file) {
    formData.append("image", file);
  }
  return formData;
}

export class ProfileService {
  // Get current user profile
  static async getCurrentProfile() {
    return await userApi.getCurrentUser();
  }

  // Update name + phone (and optionally avatar file)
  static async updateProfile(
    data: Pick<
      ProfileFormValues,
      "name" | "phone" | "idNumber" | "dateOfBirth"
    >,
    userRole: "owner" | "sitter" = "owner",
    file?: File | null,
  ) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }

    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
        idNumber: data.idNumber,
        dateOfBirth: data.dateOfBirth
          ? formatLocalDate(data.dateOfBirth)
          : null,
      },
      file,
    );

    return await userApi.updateProfile(formData, userRole);
  }

  // Update name + phone + email (requires password) + optional avatar
  static async updateProfileWithEmail(
    data: ProfileFormValues,
    password: string,
    userRole: "owner" | "sitter" = "owner",
    file?: File | null,
  ) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }
    if (!data.email?.trim()) throw new Error("Email is required");
    if (!password?.trim())
      throw new Error("Password is required to update email");

    // 1. Update profile fields (name, phone, avatar, etc.)
    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
        idNumber: data.idNumber,
        dateOfBirth: data.dateOfBirth
          ? formatLocalDate(data.dateOfBirth)
          : null,
      },
      file,
    );

    await userApi.updateProfile(formData, userRole);

    // 2. Change email via dedicated endpoint
    const result = await authApi.updateEmail(
      data.email.trim(),
      password.trim(),
    );

    if (result.error) {
      throw new Error(result.error);
    }

    return { message: "Profile and email updated successfully" };
  }
  // Remove avatar
  static async removeAvatar(
    data: Pick<
      ProfileFormValues,
      "name" | "phone" | "idNumber" | "dateOfBirth"
    >,
    userRole: "owner" | "sitter" = "owner",
  ) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }

    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
        idNumber: data.idNumber,
        dateOfBirth: data.dateOfBirth
          ? formatLocalDate(data.dateOfBirth)
          : null,
      },
      null,
      true,
    );

    return await userApi.updateProfile(formData, userRole);
  }

  static validateAvatar(file: ImageFile): { isValid: boolean; error?: string } {
    const validation = validateImage(file);

    if (validation !== true) {
      return {
        isValid: false,
        error: validation || "Invalid file",
      };
    }

    return { isValid: true };
  }
}
