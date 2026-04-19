import { SitterStatus, UserStatus } from "@/constants/status";
import { PetFormValues } from "./pet";

export interface OwnerItem {
  readonly id: string;
  name: string;
  phone: string;
  profileImgUrl: string | null;
  email: string;
  status: UserStatus;
  petCount: number;
}

export interface OwnerListResponse {
  totalOwners: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  owners: OwnerItem[];
}

export interface GetOwnerListParams {
  seed?: string;
  page: number;
  limit: number;
  keyword?: string;
  status?: UserStatus;
}

export interface OwnerProfileResponse {
  readonly id: string;
  name: string;
  phone: string;
  profileImgUrl?: string;
  idNumber?: string;
  dateOfBirth?: string;
  email: string;
  status: UserStatus;
  pets: (Omit<PetFormValues, "img_url" | "petTypeId"> & {
    id: number;
    imgUrl: string | null;
    petType: string;
  })[];
}

export interface SitterItem {
  readonly id: string;
  sitter: Pick<OwnerItem, "name" | "profileImgUrl" | "email" | "status">;
  tradeName: string;
  hasPendingUpdate: boolean;
  status: SitterStatus;
}

export interface SitterListResponse {
  totalSitters: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sitters: SitterItem[];
}

export interface GetSitterListParams {
  seed?: string;
  page: number;
  limit: number;
  keyword?: string;
  status?: SitterStatus | Extract<UserStatus, "Banned">;
}

export interface SitterProfileResponse {
  readonly id: number;
  sitter: {
    id: string;
    name: string;
    phone: string;
    profileImgUrl?: string;
    idNumber?: string;
    dateOfBirth?: string;
    email: string;
    status: UserStatus;
  };
  imgUrls: string[];
  tradeName?: string;
  experience?: number;
  petTypes: string[];
  introduction?: string;
  services?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  subDistrict?: string;
  postCode?: number;
  hasPendingUpdate: boolean;
  status: SitterStatus;
  adminNote?: string | null;
}

export type SitterPendingUpdateResponse = Omit<
  SitterProfileResponse,
  "sitter" | "hasPendingUpdate" | "status"
> & {
  sitter: Pick<
    SitterProfileResponse["sitter"],
    "name" | "phone" | "profileImgUrl" | "idNumber" | "dateOfBirth"
  >;
};

export interface GetSitterReviewParams {
  page?: number;
  limit?: number;
}

export interface SitterReview {
  readonly id: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
    profileImgUrl?: string;
  };
}

export interface SitterReviewListResponse {
  totalReviews: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  reviews: SitterReview[];
}

export interface GetSitterBookingParams {
  page?: number;
  limit?: number;
}

export interface SitterBookingItem {
  bookingId: number;
  petOwnerName: string;
  petCount: number;
  status:
    | "Waiting for confirm"
    | "Waiting for service"
    | "In service"
    | "Success"
    | "Canceled";
  startTime: string;
  endTime: string;
  bookingDate: string;
  duration: string;
  totalPrice: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  note: string | null;
}

export interface SitterBookingListResponse {
  bookings: SitterBookingItem[];
  totalPages: number;
  currentPage: number;
  limit: number;
  total: number;
}
