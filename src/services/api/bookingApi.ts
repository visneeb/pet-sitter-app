import { privateApi } from "./client";
import type { BookingDetail } from "@/types/booking";
import type {
  OwnerBookingHistory,
  SitterBookingListResponse,
} from "@/types/BookingType";

export const bookingApi = {
  getAll: (params: URLSearchParams): Promise<SitterBookingListResponse> =>
    privateApi.get("/pet-sitter/bookings", { params }).then((res) => res.data),

  getById: (bookingId: number): Promise<BookingDetail> =>
    privateApi.get(`/pet-sitter/bookings/${bookingId}`).then((res) => res.data),

  getOwnerBookingHistory: (): Promise<OwnerBookingHistory[]> =>
    privateApi.get("/bookings/owner/history").then((res) => res.data),

  updateBookingTime: (
    bookingId: number,
    startTime: string,
    endTime: string,
  ): Promise<BookingDetail> =>
    privateApi
      .patch(`/bookings/${bookingId}/time`, { startTime, endTime })
      .then((res) => res.data),

  rejectBooking: (bookingId: number): Promise<BookingDetail> =>
    privateApi
      .patch(`/pet-sitter/booking/${bookingId}/status`, { status: "rejected" })
      .then((res) => res.data),

  confirmBooking: (bookingId: number): Promise<BookingDetail> =>
    privateApi
      .patch(`/pet-sitter/booking/${bookingId}/status`, { status: "confirmed" })
      .then((res) => res.data),
};
