import LocationPetSitter from "./PetSitterCard/LocationPetSitter";
import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import TagPetType from "./PetSitterCard/TagPetType";
import PlacePicture from "./PetSitterCard/PlacePicture";
import PetSitterInfo from "./PetSitterCard/PetSitterInfo";
import useScreen from "@/hooks/useScreen";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";

export default function PetSitterCard({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  const { isSmall } = useScreenContext();
  return (
    <div
      className={cn(
        "p-4  justify-start rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-500 transition-shadow duration-300",
        isSmall ? "h-54 flex flex-row gap-10" : "h-auto flex flex-col gap-4",
      )}
    >
      <PlacePicture sitter={sitter} priority={priority} />
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <PetSitterInfo sitter={sitter} />
        <LocationPetSitter sitter={sitter} />
        <TagPetType sitter={sitter} />
      </div>
    </div>
  );
}
