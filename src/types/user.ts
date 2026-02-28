type Role = "owner" | "sitter" | "admin";
type UserStatus = "Normal" | "Banned";

export interface User {
  readonly id: string;
  name: string;
  phone: string;
  role: Role;
  profileImgUrl: string | null;
  status: UserStatus;
}

export interface UserApi {
  readonly id: string;
  name: string;
  phone: string;
  role: Role;
  profileImgUrl?: string;
  status: UserStatus;
}
