import { privateApi } from "./client";
import type { BookingDetail } from "@/types/booking";

export const bookingApi = {
  getAll: (): Promise<BookingDetail[]> =>
    privateApi.get("/pet-sitter/bookings").then((res) => res.data),

  getById: (bookingId: number): Promise<BookingDetail> =>
    privateApi.get(`/pet-sitter/booking/${bookingId}`).then((res) => res.data),
};
