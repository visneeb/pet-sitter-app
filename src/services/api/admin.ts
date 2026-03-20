import { privateApi } from "./client";
import type {
  GetSitterBookingParams,
  GetOwnerListParams,
  GetSitterListParams,
  GetSitterReviewParams,
  OwnerListResponse,
  OwnerProfileResponse,
  SitterBookingListResponse,
  SitterListResponse,
  SitterReviewListResponse,
  SitterProfileResponse,
} from "@/types/admin";
import type { BookingDetail } from "@/types/booking";

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

  getSitterPendingUpdateById: (
    sitterId: string,
    signal?: AbortSignal,
  ): Promise<
    Omit<SitterProfileResponse, "sitter" | "hasPendingUpdate" | "status">
  > =>
    privateApi
      .get<
        Omit<SitterProfileResponse, "sitter" | "hasPendingUpdate" | "status">
      >(`/admin/pet-sitter/pending-update/${sitterId}`, {
        signal,
      })
      .then((res) => res.data),

  getSitterBooking: (
    sitterId: string | number,
    params: GetSitterBookingParams,
    signal?: AbortSignal,
  ): Promise<SitterBookingListResponse> =>
    privateApi
      .get<SitterBookingListResponse>(
        `/admin/pet-sitter/bookings/${sitterId}`,
        {
          params,
          signal,
        },
      )
      .then((res) => res.data),

  getSitterBookingDetail: (
    bookingId: string | number,
    signal?: AbortSignal,
  ): Promise<BookingDetail> =>
    privateApi
      .get<BookingDetail>(`/admin/pet-sitter/booking/${bookingId}`, { signal })
      .then((res) => res.data),

  getSitterReview: (
    sitterId: string | number,
    params: GetSitterReviewParams,
    signal?: AbortSignal,
  ): Promise<SitterReviewListResponse> =>
    privateApi
      .get<SitterReviewListResponse>(`/admin/pet-sitter/reviews/${sitterId}`, {
        params,
        signal,
      })
      .then((res) => res.data),

  approveUpdateSitter: (sitterId: number, signal?: AbortSignal) =>
    privateApi.patch(`/admin/pet-sitter/approve/${sitterId}`, { signal }),

  rejectUpdateSitter: (
    sitterId: number,
    body: { adminNote: string },
    signal?: AbortSignal,
  ) =>
    privateApi.patch(`/admin/pet-sitter/reject/${sitterId}`, body, {
      signal,
    }),

  banUser: (userId: string, signal?: AbortSignal) =>
    privateApi.patch(`/admin/ban/${userId}`, { signal }),

  unbanUser: (userId: string, signal?: AbortSignal) =>
    privateApi.patch(`/admin/unban/${userId}`, { signal }),
};
