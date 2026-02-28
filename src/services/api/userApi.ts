import { privateApi } from "./client";

export type UserUpdatePayload = {
  name: string;
  phone: string;
  idNumber?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
};

export type UserUpdateResponse = {
  message: string;
};

export const userApi = {
  // Update owner profile
  updateProfile: (data: UserUpdatePayload): Promise<UserUpdateResponse> =>
    privateApi.put(`/pet-owner/user`, data).then((res) => res.data),

  // Update sitter profile
  updateSitterProfile: (data: UserUpdatePayload): Promise<UserUpdateResponse> =>
    privateApi.put(`/pet-sitter/user`, data).then((res) => res.data),

  // Get current user profile
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

  // Reset password
  resetPassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> =>
    privateApi.put("/auth/reset-password", data).then((res) => res.data),
};
