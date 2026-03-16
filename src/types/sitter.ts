import { User, UserApi } from "./user";

export interface Sitter {
  readonly id: number;
  sitter: Pick<User, "name" | "profileImgUrl">;
  imgUrls: string[] | null;
  imgUrl: string | null;
  tradeName: string | null;
  experience: number | null;
  rating: number | null;
  petTypes: string[];
  introduction: string | null;
  services: string | null;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  district: string | null;
  subDistrict: string | null;
  postCode: number | null;
  reviewCount: number | null;
}

export interface SitterApi {
  readonly id: number;
  sitter: Pick<UserApi, "name" | "profileImgUrl">;
  imgUrls?: string[];
  imgUrl?: string;
  tradeName?: string;
  experience?: number;
  rating?: number;
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
  reviewCount?: number;
}

export interface SittersResponse {
  totalSitters: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sitters: SitterApi[];
}

export interface SitterProfile {
  id: number;
  tradeName: string;
  experience: number;
  petTypeIds: number[];
  introduction?: string;
  services?: string;
  description?: string;
  address: string;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  latitude?: number;
  longitude?: number;
  images: string[];
}
