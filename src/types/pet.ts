export interface Pet {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Bird";
  imageUrl?: string;
}
