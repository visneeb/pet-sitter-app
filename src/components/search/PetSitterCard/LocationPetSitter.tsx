import { useScreenContext } from "@/contexts/ScreenContext";
import { PetSitter } from "@/types/PetSittersType";
import cn from "@/utils/cn";
import { MapPin } from "lucide-react";

export default function LocationPetSitter({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall, isLarge, isXLarge } = useScreenContext();
  const isWebViewMini = isLarge && !isXLarge;
  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center text-gray-400",
        isSmall
          ? isWebViewMini
            ? "sytle-body-3 gap-[6px]"
            : " style-body-2 gap-[10px]"
          : "sytle-body-3 gap-[6px]",
      )}
    >
      <MapPin color="#AEB1C3" size={isSmall ? (isWebViewMini ? 12 : 20) : 12} />
      {sitter.province}
    </div>
  );
}
