import { publicApi, privateApi } from "./client";
import type { SitterApi } from "@/types/sitter";

export interface PetSitterListParams {
  page?: number;
  limit?: number;
  keyword?: string;
  pet_type?: string;
  rating?: number;
  experience?: string;
  seed?: string;
}

export interface Sitter {
  name: string;
  profileImgUrl: string | null;
}

export interface PetSitterListItem {
  id: string;
  sitter: Sitter;
  imgUrl: string;
  tradeName: string;
  rating: number | null;
  petTypes: string[];
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  district: string | null;
}

export interface PetSitterListResponse {
  totalPetSitters: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sitters: PetSitterListItem[];
}

export async function getPetSitters(
  params?: PetSitterListParams,
): Promise<{ data?: PetSitterListResponse; error?: string }> {
  try {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.keyword) query.set("keyword", params.keyword.trim());
    if (params?.pet_type) query.set("pet_type", params.pet_type);
    if (params?.rating !== undefined)
      query.set("rating", String(params.rating));
    if (params?.experience) query.set("experience", params.experience);
    if (params?.seed) query.set("seed", params.seed);

    const qs = query.toString();
    const res = await publicApi.get<PetSitterListResponse>(
      `/pet-sitter${qs ? `?${qs}` : ""}`,
    );

    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch pet sitters",
    };
  }
}

export const PET_SITTER_STATUS = {
  WAITING: "Waiting for approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  UNAPPROVED: "Unapproved",
} as const;

export type PetSitterStatus =
  (typeof PET_SITTER_STATUS)[keyof typeof PET_SITTER_STATUS];

/** API response shape for pet-sitter detail; derives from SitterApi for type compatibility with toSitter() */
export type PetSitterDetail = SitterApi & {
  status?: string;
  adminNote?: string | null;
  provinceId?: number | null;
  districtId?: number | null;
  subDistrictId?: number | null;
};

function buildPetSitterDetailPath(
  sitterId: string,
  options?: { onlyApproved?: boolean },
) {
  const params = new URLSearchParams();
  if (options?.onlyApproved === false) {
    params.set("onlyApproved", "false");
  }

  const queryString = params.toString();
  return `/pet-sitter/${sitterId}${queryString ? `?${queryString}` : ""}`;
}

export async function getPetSitterById(
  sitterId: string,
  options?: { onlyApproved?: boolean },
): Promise<{ data?: PetSitterDetail; error?: string }> {
  try {
    const res = await privateApi.get<PetSitterDetail>(
      buildPetSitterDetailPath(sitterId, options),
    );
    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch pet sitter",
    };
  }
}

export const getPrivatePetSitterById = getPetSitterById;

export async function getPublicPetSitterById(
  sitterId: string,
  options?: { onlyApproved?: boolean },
): Promise<{ data?: PetSitterDetail; error?: string }> {
  try {
    const res = await publicApi.get<PetSitterDetail>(
      buildPetSitterDetailPath(sitterId, options),
    );
    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch pet sitter",
    };
  }
}

export async function getCurrentSitter(): Promise<{
  data?: PetSitterDetail;
  error?: string;
}> {
  try {
    const res = await privateApi.get<PetSitterDetail>("/pet-sitter/profile");
    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch current sitter profile",
    };
  }
}

export async function getPetSitterByUserId(
  userId: string,
): Promise<{ data?: PetSitterDetail; error?: string }> {
  try {
    const res = await privateApi.get<PetSitterDetail>(`/pet-sitter/${userId}`);
    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch pet sitter by user ID",
    };
  }
}

export async function getPetSitterByUserIdSimple(
  userId: string,
): Promise<{ data?: PetSitterDetail; error?: string }> {
  return getPetSitterByUserId(userId);
}

// ─── Sitter Reviews ─────────────────────────────────────────────────────────

export interface ReviewApi {
  reviewer: {
    name: string;
    profileImgUrl?: string;
  };
  createdAt: string;
  comment: string;
  rating: number;
}

export interface SitterReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface SitterReviewsResponse {
  reviews: ReviewApi[];
  totalPages: number;
  currentPage: number;
  totalReviews: number;
}

export async function getSitterReviewsById(
  sitterId: string,
  params?: SitterReviewsParams,
): Promise<{ data?: SitterReviewsResponse; error?: string }> {
  try {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.rating !== undefined)
      query.set("rating", String(params.rating));

    const qs = query.toString();
    const res = await publicApi.get<SitterReviewsResponse>(
      `/pet-sitter/${sitterId}/reviews${qs ? `?${qs}` : ""}`,
    );

    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch sitter reviews",
    };
  }
}

export interface ExistingImage {
  url: string;
  order: number;
}

export interface UpdatePetSitterProfileBody {
  experience: number;
  tradeName: string;
  petTypeIds: number[];
  introduction?: string;
  services?: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  existingImages: ExistingImage[];
}

export async function updatePetSitterProfile(
  body: UpdatePetSitterProfileBody,
  images?: File[],
): Promise<{ message?: string; error?: string }> {
  try {
    if (images && images.length > 10) {
      return { error: "Maximum 10 images allowed" };
    }

    const formData = new FormData();
    formData.append("body", JSON.stringify(body));
    images?.forEach((img) => formData.append("images", img));

    const res = await privateApi.put<{ message: string }>(
      `/pet-sitter/profile`,
      formData,
    );

    return { message: res.data.message };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to update sitter profile",
    };
  }
}

export async function cancelPetSitterProfileUpdate() {
  const res = await privateApi.delete<{ message: string }>(
    "/pet-sitter/profile/cancel",
  );
  return { message: res.data.message };
}

export async function deleteRejectNote() {
  await privateApi.delete("/pet-sitter/note");
}
