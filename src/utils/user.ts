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

export function phoneWithSpace(phone: string) {
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

export function idNumberWithHyphen(idNumber: string) {
  return `${idNumber.slice(0, 1)}-${idNumber.slice(1, 5)}-${idNumber.slice(
    5,
    10,
  )}-${idNumber.slice(10, 12)}-${idNumber.slice(12)}`;
}
