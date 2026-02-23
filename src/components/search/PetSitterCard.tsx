import LocationPetSitter from "./PetSitterCard/LocationPetSitter";
import { PetSitter } from "@/hooks/PetSitterPage/usePetSitterData";
import TagPetType from "./PetSitterCard/TagPetType";
import PlacePicture from "./PetSitterCard/PlacePicture";
import PetSitterInfo from "./PetSitterCard/PetSitterInfo";

export default function PetSitterCard({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  return (
    <div className="h-54 p-4 flex flex-row justify-start gap-10 rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <PlacePicture sitter={sitter} priority={priority} />
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <PetSitterInfo sitter={sitter} />
        <LocationPetSitter sitter={sitter} />
        <TagPetType sitter={sitter} />
      </div>
    </div>
  );
}
