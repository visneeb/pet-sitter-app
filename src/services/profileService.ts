import { userApi } from "./api/userApi";
import { uploadAvatarApi, deleteAvatarApi } from "./api/avatarApi";
import { ProfileFormValues } from "@/lib/validations/profileValidation";
import { ImageFile } from "@/types/imageUploadType";
import { validateImage } from "@/lib/validations/useImageValidation";

export class ProfileService {
  //Get current user profile
  static async getCurrentProfile() {
    return await userApi.getCurrentUser();
  }

  //Update user profile (name and phone only)
  static async updateProfile(data: Pick<ProfileFormValues, "name" | "phone">) {
    const payload = {
      name: data.name,
      phone: data.phone,
    };

    console.log("Updating profile with payload:", payload);
    const result = await userApi.updateProfile(payload);
    console.log("Profile update response:", result);

    return result;
  }

  //Update user profile including email (requires password)
  static async updateProfileWithEmail(
    data: ProfileFormValues,
    password: string,
  ) {
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: password,
    };

    console.log("Updating email with payload:", payload);
    const result = await userApi.updateProfile(payload);
    console.log("Email update response:", result);

    return result;
  }

  //Upload avatar image
  static async uploadAvatar(file: ImageFile, oldUrl?: string) {
    if (!file) {
      throw new Error("No file provided");
    }

    // Delete old avatar if exists
    if (oldUrl) {
      await deleteAvatarApi(oldUrl);
    }

    const result = await uploadAvatarApi(file);
    if (result.error) {
      throw new Error(result.error);
    }

    return result.publicUrl;
  }

  //Delete avatar
  static async deleteAvatar(publicUrl: string) {
    return await deleteAvatarApi(publicUrl);
  }

  //Validate avatar file
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
