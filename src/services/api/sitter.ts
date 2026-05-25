import { publicApi, privateApi } from "./client";
import type { SitterApi } from "@/types/sitter";

// ─── Types & Interfaces ──────────────────────────────────────────────────────

// Query params for filtering the pet sitter list
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

// Single item in the pet sitter listing
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

// Paginated response for pet sitter list
export interface PetSitterListResponse {
  totalPetSitters: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sitters: PetSitterListItem[];
}

// ─── Pet Sitter List ─────────────────────────────────────────────────────────

// Fetches paginated & filtered list of pet sitters (public)
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

// ─── Pet Sitter Detail ───────────────────────────────────────────────────────

export const PET_SITTER_STATUS = {
  WAITING: "Waiting for approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  UNAPPROVED: "Unapproved",
} as const;

export type PetSitterStatus =
  (typeof PET_SITTER_STATUS)[keyof typeof PET_SITTER_STATUS];

// Full detail shape — extends SitterApi with admin-only fields
export type PetSitterDetail = SitterApi & {
  status?: string;
  adminNote?: string | null;
  provinceId?: number | null;
  districtId?: number | null;
  subDistrictId?: number | null;
};

// Builds the detail endpoint path, optionally bypassing approved-only filter
function buildPetSitterDetailPath(
  sitterId: string,
  options?: { onlyApproved?: boolean },
) {
  const params = new URLSearchParams();
  if (options?.onlyApproved === false) params.set("onlyApproved", "false");
  const queryString = params.toString();
  return `/pet-sitter/${sitterId}${queryString ? `?${queryString}` : ""}`;
}

// Fetches sitter detail via authenticated (private) API
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

export const getPrivatePetSitterById = getPetSitterById; // Alias for explicit private usage

// Fetches sitter detail via public API (no auth required)
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

// Fetches the currently logged-in sitter's own profile
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

// Fetches a sitter's detail by user ID (private)
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

export async function getPetSitterByUserIdSimple(userId: string) {
  return getPetSitterByUserId(userId); // Thin wrapper kept for API consistency
}

// ─── Available Booking Hours ─────────────────────────────────────────────────

export interface AvailableHoursParams {
  date: string;
  exceptedBookingId?: number; // Exclude a specific booking when checking availability (e.g. rescheduling)
}

export interface AvailableHoursResponse {
  availableSlots: string[];
}

// Fetches open time slots for a sitter on a given date (public)
export async function getAvailableHoursBySitterId(
  sitterId: string,
  params: AvailableHoursParams,
): Promise<{ data?: AvailableHoursResponse; error?: string }> {
  try {
    const query = new URLSearchParams();
    query.set("date", params.date);
    if (params.exceptedBookingId !== undefined) {
      query.set("exceptedBookingId", String(params.exceptedBookingId));
    }
    const res = await publicApi.get<AvailableHoursResponse>(
      `/pet-sitter/bookings/available-hours/${sitterId}?${query.toString()}`,
    );
    return { data: res.data };
  } catch (err: any) {
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to fetch available booking hours",
    };
  }
}

// ─── Sitter Reviews ──────────────────────────────────────────────────────────

export interface ReviewApi {
  reviewer: { name: string; profileImgUrl?: string };
  createdAt: string;
  comment: string;
  rating: number;
}

export interface SitterReviewsParams {
  page?: number;
  limit?: number;
  rating?: number; // Filter by star rating
}

export interface SitterReviewsResponse {
  reviews: ReviewApi[];
  totalPages: number;
  currentPage: number;
  totalReviews: number;
}

// Fetches paginated reviews for a sitter (public)
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

// ─── Profile Update ──────────────────────────────────────────────────────────

export interface ExistingImage {
  url: string;
  order: number; // Display order of the image
}

// Fields allowed in a sitter profile update request
export interface UpdatePetSitterProfileBody {
  // User fields
  name?: string;
  phone?: string;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  removeProfileImg?: boolean; // Flag to delete current profile picture

  // Sitter fields
  experience?: number | null;
  tradeName?: string | null;
  petTypeIds?: number[] | null;
  introduction?: string | null;
  services?: string | null;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  provinceId?: number | null;
  districtId?: number | null;
  subDistrictId?: number | null;
  existingImages?: ExistingImage[]; // Retained images after editing
}

// Submits profile update as multipart/form-data (supports image uploads, max 10)
export async function updatePetSitterProfile(
  body: UpdatePetSitterProfileBody, // JSON fields (name, address, etc.)
  images?: File[], // Gallery images (optional)
  profileImage?: File, // Profile picture (optional)
): Promise<{ message?: string; error?: string }> {
  try {
    // Guard: count total images across both params and reject if over limit
    const totalImages = (images?.length || 0) + (profileImage ? 1 : 0);
    if (totalImages > 10) return { error: "Maximum 10 images allowed" };

    // Build multipart form — body goes as a JSON string, images as raw File blobs
    const formData = new FormData();
    formData.append("body", JSON.stringify(body));
    if (profileImage) formData.append("profileImage", profileImage);
    images?.forEach((img) => formData.append("images", img));

    const res = await privateApi.put<{ message: string }>(
      `/pet-sitter/profile`,
      formData,
    );
    return { message: res.data.message };
  } catch (err: any) {
    // Prioritize server error message, fall back to generic
    return {
      error:
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to update sitter profile",
    };
  }
}

// Cancels a pending profile update request
export async function cancelPetSitterProfileUpdate() {
  const res = await privateApi.delete<{ message: string }>(
    "/pet-sitter/profile/cancel",
  );
  return { message: res.data.message };
}

// Clears the admin rejection note from the sitter's profile
export async function deleteRejectNote() {
  await privateApi.delete("/pet-sitter/note");
}
