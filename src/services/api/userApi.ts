import { privateApi } from "./client";

export type UserUpdateResponse = {
  message: string;
};

export const userApi = {
  updateProfile: (formData: FormData): Promise<UserUpdateResponse> =>
    privateApi.put(`/pet-owner/user`, formData).then((res) => res.data),

  updateSitterProfile: (formData: FormData): Promise<UserUpdateResponse> =>
    privateApi.put(`/pet-sitter/user`, formData).then((res) => res.data),

  getCurrentUser: (): Promise<{
    id: string;
    email: string;
    name: string;
    phone: string;
    idNumber?: string;
    dateOfBirth?: string;
    profileImgUrl: string;
    role: string;
  }> => privateApi.get("/auth/get-user").then((res) => res.data),

  resetPassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> =>
    // JSON request
    privateApi.put("/auth/reset-password", data).then((res) => res.data),
};
