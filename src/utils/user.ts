import { User, UserApi } from "@/types/user";

export function toUser(userApi: UserApi): User {
  return {
    id: userApi.id,
    name: userApi.name,
    phone: userApi.phone,
    role: userApi.role,
    profileImgUrl: userApi.profileImgUrl ?? null,
    status: userApi.status,
  };
}

export function mapToUser(userApi: UserApi[]): User[] {
  return userApi.map(toUser);
}
