import { publicApi, privateApi } from "./client";
import { RegisterFormValues, Role, LoginFormValues } from "@/types/authType";

const roleMap: Record<Role, "owner" | "sitter"> = {
  owner: "owner",
  sitter: "sitter",
};

export type RegisterPayload = RegisterFormValues & { role: Role };
export type RegisterResponse = { message?: string };

export type LoginPayload = LoginFormValues;
export type LoginResponse = { message?: string };

export type ResetPasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
export type ResetPasswordResponse = { message?: string };

export type LogoutResponse = { message?: string };

export const authApi = {
  register: (data: RegisterPayload): Promise<RegisterResponse> =>
    publicApi
      .post("/auth/register", {
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        password: data.password,
        role: roleMap[data.role],
      })
      .then((res) => res.data),

  login: (data: LoginPayload): Promise<LoginResponse> =>
    publicApi
      .post("/auth/login", {
        email: data.email?.trim(),
        password: data.password,
      })
      .then((res) => res.data),

  resetPassword: (data: ResetPasswordPayload): Promise<ResetPasswordResponse> =>
    privateApi
      .put("/auth/reset-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      .then((res) => res.data),

  logout: (): Promise<LogoutResponse> =>
    privateApi.post("/auth/logout").then((res) => res.data),
};
