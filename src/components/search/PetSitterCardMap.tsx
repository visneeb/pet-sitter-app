import LocationPetSitter from "./PetSitterCard/LocationPetSitter";

import TagPetType from "./PetSitterCard/TagPetType";
import PlacePicture from "./PetSitterCard/PlacePicture";
import PetSitterInfo from "./PetSitterCard/PetSitterInfo";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";

export default function PetSitterCardMap({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  
  return (
    <div
      className={cn(
        "w-[471px] h-[138px] min-w-[260px] flex-shrink-0flex flex-row items-center gap-3 rounded-2xl bg-white border border-zinc-100 shadow-md px-3 py-3 transition-all duration-200 hover:shadow-lg cursor-pointer",
      )}
    >
      <PlacePicture sitter={sitter} priority={priority} />
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-2">
        <PetSitterInfo sitter={sitter} />
        <LocationPetSitter sitter={sitter} />
        <TagPetType sitter={sitter} />
      </div>
    </div>
  );
}
