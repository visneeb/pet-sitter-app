import { privateApi, publicApi } from "./client";

export type SitterProfileUpdatePayload = {
  experience: number;
  tradeName: string;
  address: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  petTypeIds?: number[];
  introduction?: string;
  services?: string;
  description?: string;
};

export type SitterUserUpdatePayload = {
  name: string;
  phone: string;
  idNumber?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
};

export type SitterProfileResponse = {
  id: number;
  sitter: string;
  imgUrls: string[];
  tradeName: string;
  experience: number;
  rating: number;
  petTypes: string[];
  introduction: string;
  services: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  postCode: string;
};

export const sitterApi = {
  // Update sitter profile
  updateProfile: (data: SitterProfileUpdatePayload): Promise<{ message: string }> =>
    privateApi.put("/pet-sitter/", data).then((res) => res.data),

  // Update sitter user info
  updateUser: (data: SitterUserUpdatePayload): Promise<{ message: string }> =>
    privateApi.put("/pet-sitter/user", data).then((res) => res.data),

  // Get sitter by ID
  getById: (sitterId: number): Promise<SitterProfileResponse> =>
    publicApi.get(`/pet-sitter/${sitterId}`).then((res) => res.data),
};
