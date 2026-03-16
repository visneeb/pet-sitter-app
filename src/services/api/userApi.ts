import { privateApi } from "./client";
import { buildFormData } from "@/lib/utils/formData";

export type UserUpdateResponse = {
  message: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  idNumber?: string;
  dateOfBirth?: string;
  profileImgUrl: string;
  role: string;
  sitterId?: string;
};

export const userApi = {
  getCurrentUser: (): Promise<CurrentUser> =>
    privateApi.get("/auth/get-user").then((res) => res.data),

  updateProfile: (
    formData: FormData,
    userRole: "owner" | "sitter" = "owner",
  ): Promise<UserUpdateResponse> => {
    const endpoint =
      userRole === "sitter" ? "/pet-sitter/user" : "/pet-owner/user";
    return privateApi.put(endpoint, formData).then((res) => res.data);
  },

  updateEmail: async (
    newEmail: string,
    password: string,
    userRole: "owner" | "sitter" = "owner",
  ): Promise<{ success?: boolean; error?: string }> => {
    try {
      const endpoint =
        userRole === "sitter" ? "/pet-sitter/user" : "/pet-owner/user";
      const formData = buildFormData({ email: newEmail, password });
      await privateApi.put(endpoint, formData);
      return { success: true };
    } catch (error: any) {
      return {
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to update email",
      };
    }
  },
};
