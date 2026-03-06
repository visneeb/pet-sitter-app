import { publicApi, privateApi } from "./client";
import { RegisterFormValues, Role, LoginFormValues } from "@/types/authType";

export type RegisterPayload = RegisterFormValues & { role: Role };
export type RegisterResponse = { message?: string };

export type LoginPayload = LoginFormValues;
export type LoginResponse = { message?: string; accessToken?: string };

export type ResetPasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
export type ResetPasswordResponse = { message?: string };

export type LogoutResponse = { message?: string };

export const authApi = {
  register: (data: RegisterPayload): Promise<RegisterResponse> => {
    const payload = {
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      password: data.password,
      role: data.role,
    };
    return publicApi.post("/auth/register", payload).then((res) => res.data);
  },

  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const res = await publicApi.post("/auth/login", {
      email: data.email?.trim(),
      password: data.password,
    });

    const token = res.data?.accessToken;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }

    return res.data;
  },

  resetPassword: (data: ResetPasswordPayload): Promise<ResetPasswordResponse> =>
    privateApi
      .put("/auth/reset-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      .then((res) => res.data),

  logout: async (): Promise<LogoutResponse> => {
    try {
      const res = await privateApi.post("/auth/logout");
      return res.data;
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    }
  },
};