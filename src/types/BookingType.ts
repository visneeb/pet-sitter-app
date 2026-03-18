export type BookingStatus =
  | "Waiting for confirm"
  | "Waiting for service"
  | "In service"
  | "Success"
  | "Canceled";

export interface BookingPet {
  bookingPetId: number;
  bookingId: number;
  petId: number | null;
  petTypeId: number;
  petName: string;
  sex: "Male" | "Female" | "Unknown";
  breed: string;
  dateOfBirth: string;
  color: string;
  weight: string;
  about: string | null;
}

export interface Booking {
  bookingId: number;
  petOwnerId: string;
  petSitterId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingReview {
  reviewId: number;
  bookingId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export type OwnerBookingHistory = Pick<
  Booking,
  | "bookingId"
  | "status"
  | "startTime"
  | "endTime"
  | "totalPrice"
  | "contactName"
  | "contactPhone"
  | "contactEmail"
  | "note"
  | "createdAt"
  | "petSitterId"
> & {
  tradeName: string | null;
  sitterName: string | null;
  sitterImgUrl: string | undefined;
  pets: BookingPet[];
  review: BookingReview | null;
};


export interface SitterBookingList{
  bookingId: number;
  petOwnerName: string;
  petCount: number;
  duration: string;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SitterBookingListResponse {
  totalBookings: number;
  totalPages: number;
  bookings: SitterBookingList[];
}

export interface SitterBookingRangeItem {
  id: number;
  ownerName: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface SitterBookingRangeResponse {
  bookings: SitterBookingRangeItem[];
}