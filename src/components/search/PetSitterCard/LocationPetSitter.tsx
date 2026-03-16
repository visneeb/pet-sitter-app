import { PetSitter } from "@/types/PetSittersType";
import cn from "@/utils/cn";
import { MapPin } from "lucide-react";

export default function LocationPetSitter({
  sitter,
  className,
}: Readonly<{ sitter: PetSitter; className?: string }>) {
  const sizeClass = cn(
    "flex flex-row justify-start items-center text-gray-400",
    "style-body-3 gap-[6px]",
    "sm:style-body-1 gap-[8px]",
    className,
  );
  return (
    <div className={cn(sizeClass)}>
      <MapPin color="#AEB1C3" size={12} />
      {sitter.province}
    </div>
  );
}
