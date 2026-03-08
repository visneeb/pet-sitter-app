import { privateApi } from "./client";
import type { GetOwnerListParams, OwnerListResponse } from "@/types/admin";

export const adminApi = {
  getOwnerList: (
    params: GetOwnerListParams,
    signal?: AbortSignal,
  ): Promise<OwnerListResponse> =>
    privateApi
      .get<OwnerListResponse>("/admin/pet-owner", { params, signal })
      .then((res) => res.data),
};
