import { PetType, PetTypeApi } from "@/types/pet";

export function toPet(petTypeApi: PetTypeApi): PetType {
  return {
    id: petTypeApi.id,
    name: petTypeApi.petType,
  };
}

export function mapToPet(petTypeApi: PetTypeApi[]): PetType[] {
  return petTypeApi.map(toPet);
}
