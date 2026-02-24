import { useScreenContext } from "@/contexts/ScreenContext";
import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import cn from "@/utils/cn";
import { MapPin } from "lucide-react";

export default function LocationPetSitter({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall } = useScreenContext();
  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center text-gray-400",
        isSmall ? " style-body-2 gap-[10px]" : "sytle-body-3 gap-[6px]",
      )}
    >
      <MapPin color="#AEB1C3" size={isSmall ? 20 : 12} />
      {sitter.location}
    </div>
  );
}
