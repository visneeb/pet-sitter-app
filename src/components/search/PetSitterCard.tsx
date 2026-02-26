import LocationPetSitter from "./PetSitterCard/LocationPetSitter";

import TagPetType from "./PetSitterCard/TagPetType";
import PlacePicture from "./PetSitterCard/PlacePicture";
import PetSitterInfo from "./PetSitterCard/PetSitterInfo";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";

export default function PetSitterCard({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  const { isSmall, isMedium, isLarge, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium;
  const isWebViewMini = isLarge && !isXLarge;
  return (
    <div
      className={cn(
        "p-4 justify-start rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-500 transition-shadow duration-300",
        isWebView
          ? isWebViewMini
            ? "w-full max-w-[355px]"
            : "h-54 flex flex-row gap-10 w-full"
          : "w-[335px] min-w-[335px] min-h-[268px] flex flex-col gap-4",
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
