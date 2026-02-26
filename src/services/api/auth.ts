import { publicApi } from "@/lib/publicApi";
import { RegisterFormValues, Role, LoginFormValues } from "@/types/authType";

const roleMap: Record<Role, "owner" | "sitter"> = {
  customer: "owner",
  sitter: "sitter",
};

export type RegisterPayload = RegisterFormValues & { role: Role };
export type RegisterResponse = { message?: string };

export type LoginPayload = LoginFormValues;
export type LoginResponse = { message?: string };

export const authApi = {
  register: (data: RegisterPayload): Promise<RegisterResponse> =>
    publicApi
      .post("/auth/register", {
        email: data.email.trim(),
        phone: data.phone.trim(),
        password: data.password,
        role: roleMap[data.role],
      })
      .then((res) => res.data),

  login: (data: LoginPayload): Promise<LoginResponse> =>
    publicApi
      .post("/auth/login", {
        email: data.email.trim(),
        password: data.password,
      })
      .then((res) => res.data),

  logout: () => publicApi.post("/auth/logout").then((res) => res.data),
};
