export interface BookingDetail {
  bookingId: number;
  status: string;
  startTime: string;
  endTime: string;
  totalPrice: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
  pets: { petId: number; name: string }[];
}
