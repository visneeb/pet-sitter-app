import { userApi } from "./api/userApi";
import { ProfileFormValues } from "@/lib/validations/profileValidation";
import { ImageFile } from "@/types/imageUploadType";
import { validateImage } from "@/lib/validations/useImageValidation";

// Builds a FormData payload the backend expects:
//    - field "body": stringified JSON with name/phone/email/password etc.
//    - field "file": the image File (optional)
//    - field "removeProfileImg": "true" if removing avatar (optional)
export function buildFormData(
  bodyJson: object,
  file?: File | null,
  removeProfileImg?: boolean,
): FormData {
  const formData = new FormData();
  formData.append("body", JSON.stringify(bodyJson));
  if (file) {
    formData.append("image", file);
  }
  if (removeProfileImg) {
    formData.append("removeProfileImg", "true");
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
    data: Pick<ProfileFormValues, "name" | "phone">,
    file?: File | null,
  ) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }

    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
      },
      file,
    );

    console.log("Updating profile:", {
      name: data.name.trim(),
      phone: data.phone.trim(),
      hasFile: !!file,
    });

    return await userApi.updateProfile(formData);
  }

  // Update name + phone + email (requires password) + optional avatar
  static async updateProfileWithEmail(
    data: ProfileFormValues,
    password: string,
    file?: File | null,
  ) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }
    if (!data.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!password?.trim()) {
      throw new Error("Password is required to update email");
    }

    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        password: password.trim(),
      },
      file,
    );

    console.log("Updating profile with email:", {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      hasFile: !!file,
      password: "***",
    });

    return await userApi.updateProfile(formData);
  }

  // Remove avatar
  static async removeAvatar(data: Pick<ProfileFormValues, "name" | "phone">) {
    if (!data.name?.trim() || !data.phone?.trim()) {
      throw new Error("Name and phone are required");
    }

    const formData = buildFormData(
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
      },
      null,
      true,
    );

    return await userApi.updateProfile(formData);
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
