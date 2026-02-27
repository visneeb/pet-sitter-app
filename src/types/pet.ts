export interface PetType {
  readonly id: number;
  name: string;
}
export interface PetTypeApi {
  readonly id: number;
  name: string;
}

export interface PetForm {
  name: string;
  type: string;
  breed: string;
  sex: string;
  age: string;
  color: string;
  weight: string;
  description: string;
}
