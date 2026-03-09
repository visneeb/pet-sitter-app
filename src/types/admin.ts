import { SitterStatus, UserStatus } from "@/constants/status";

export interface OwnerItem {
  id: string;
  name: string;
  phone: string;
  profileImgUrl: string | null;
  email: string;
  status: UserStatus;
  petCount: number;
}

export interface OwnerListResponse {
  totalOwners: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  owners: OwnerItem[];
}

export interface GetOwnerListParams {
  seed?: string;
  page: number;
  limit: number;
  keyword?: string;
  status?: UserStatus;
}

export interface SitterItem {
  id: string;
  sitter: Pick<OwnerItem, "name" | "profileImgUrl" | "email" | "status">;
  tradeName: string;
  status: SitterStatus;
}

export interface SitterListResponse {
  totalSitters: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sitters: SitterItem[];
}

export interface GetSitterListParams {
  seed?: string;
  page: number;
  limit: number;
  keyword?: string;
  status?: SitterStatus | Extract<UserStatus, "Banned">;
}
