export interface PetType {
  readonly id: number;
  name: string;
}

export interface PetTypeApi {
  readonly id: number;
  petType: string;
}

export interface PetFormValues {
  img_url: File | string | null;
  petName: string;
  petTypeId: number;
  breed: string;
  sex: string;
  dateOfBirth: Date | null;
  color: string;
  weight: string;
  about: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  imgUrl?: string;
}