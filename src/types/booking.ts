export type BookingStatus =
  | "Waiting for confirm"
  | "Waiting for service"
  | "In service"
  | "Success"
  | "Canceled";

export interface BookingDetail {
  bookingId: number;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  duration: string;
  totalPrice: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
  // Pet owner
  petOwnerName: string;
  petOwnerEmail: string;
  petOwnerPhone: string;
  petOwnerDateOfBirth?: string;
  petOwnerProfileImg?: string;
  // Pets
  pets: {
    petId: number | null;
    petName: string;
    petType: string;
    sex: string;
    breed: string;
    color: string;
    weight: string;
    dateOfBirth: string;
    about?: string;
    imgUrl?: string;
  }[];
}

export type LabelValueProps = {
  label: string;
  value: string | number;
  className?: string;
};

export type StatusConfig = {
  label: string;
  badgeClass: string;
  buttonLabel: string | null;
  showReject: boolean;
  nextStatus: BookingStatus | null;
  isDisabled?: boolean;
};