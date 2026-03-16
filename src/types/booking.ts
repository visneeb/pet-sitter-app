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
  // Pet owner info
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
