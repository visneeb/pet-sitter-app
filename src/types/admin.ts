import { SitterStatus, UserStatus } from "@/constants/status";
import { PetFormValues } from "./pet";

export interface OwnerItem {
  readonly id: string;
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

export interface OwnerProfileResponse {
  readonly id: string;
  name: string;
  phone: string;
  profileImgUrl?: string;
  idNumber?: string;
  dateOfBirth?: string;
  email: string;
  status: UserStatus;
  pets: PetFormValues[];
}

export interface SitterItem {
  readonly id: string;
  sitter: Pick<OwnerItem, "name" | "profileImgUrl" | "email" | "status">;
  tradeName: string;
  hasPendingUpdate: boolean;
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

export interface SitterProfileResponse {
  readonly id: number;
  sitter: {
    id: string;
    name: string;
    phone: string;
    profileImgUrl?: string;
    idNumber?: string;
    dateOfBirth?: string;
    email: string;
    status: UserStatus;
  };
  imgUrls: string[];
  tradeName?: string;
  experience?: number;
  petTypes: string[];
  introduction?: string;
  services?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  subDistrict?: string;
  postCode?: number;
  hasPendingUpdate: boolean;
  status: SitterStatus;
}
