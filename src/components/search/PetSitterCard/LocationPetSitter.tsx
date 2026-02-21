import { PetSitter } from "@/hooks/usePetSitterData";
import { MapPin } from "lucide-react";

export default function LocationPetSitter({ sitter }: Readonly<{ sitter: PetSitter }>) {
    return (
          <div className="flex items-center text-gray-400 style-body-2">
            <MapPin />
            {sitter.location}
          </div>
    )
}