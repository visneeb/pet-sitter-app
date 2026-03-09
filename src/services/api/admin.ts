import { privateApi } from "./client";
import type {
  GetOwnerListParams,
  GetSitterListParams,
  OwnerListResponse,
  SitterListResponse,
} from "@/types/admin";

export const adminApi = {
  getOwnerList: (
    params: GetOwnerListParams,
    signal?: AbortSignal,
  ): Promise<OwnerListResponse> =>
    privateApi
      .get<OwnerListResponse>("/admin/pet-owner", { params, signal })
      .then((res) => res.data),

  getSitterList: (
    params: GetSitterListParams,
    signal?: AbortSignal,
  ): Promise<SitterListResponse> =>
    privateApi
      .get<SitterListResponse>("/admin/pet-sitter", { params, signal })
      .then((res) => res.data),
};
