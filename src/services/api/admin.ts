import { privateApi } from "./client";
import type {
  GetOwnerListParams,
  GetSitterListParams,
  OwnerListResponse,
  OwnerProfileResponse,
  SitterListResponse,
  SitterProfileResponse,
} from "@/types/admin";

export const adminApi = {
  getOwnerList: (
    params: GetOwnerListParams,
    signal?: AbortSignal,
  ): Promise<OwnerListResponse> =>
    privateApi
      .get<OwnerListResponse>("/admin/pet-owner", { params, signal })
      .then((res) => res.data),

  getOwnerById: (
    userId: string,
    signal?: AbortSignal,
  ): Promise<OwnerProfileResponse> =>
    privateApi
      .get<OwnerProfileResponse>(`/admin/pet-owner/${userId}`, { signal })
      .then((res) => res.data),

  getSitterList: (
    params: GetSitterListParams,
    signal?: AbortSignal,
  ): Promise<SitterListResponse> =>
    privateApi
      .get<SitterListResponse>("/admin/pet-sitter", { params, signal })
      .then((res) => res.data),

  getSitterById: (
    sitterId: string,
    signal?: AbortSignal,
  ): Promise<SitterProfileResponse> =>
    privateApi
      .get<SitterProfileResponse>(`/admin/pet-sitter/${sitterId}`, { signal })
      .then((res) => res.data),
};
