import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import { MapPin } from "lucide-react";

export default function LocationPetSitter({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex items-center gap-[10px] text-gray-400 style-body-2">
      <MapPin color="#AEB1C3" size={20} />
      {sitter.location}
    </div>
  );
}
