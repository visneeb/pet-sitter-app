import LocationPetSitter from "./PetSitterCard/LocationPetSitter";
import TagPetType from "./PetSitterCard/TagPetType";
import PlacePicture from "./PetSitterCard/PlacePicture";
import PetSitterInfo from "./PetSitterCard/PetSitterInfo";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";
import Link from "next/link";

export default function PetSitterCard({
  sitter,
  priority = false,
  className,
}: Readonly<{ sitter: PetSitter; priority?: boolean; className?: string }>) {
  return (
    <Link
      href={`/petsitter/${sitter.id}`}
      className={cn(
        "p-4 justify-start rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-500 transition-shadow duration-300",
        "w-[335px] min-w-[335px] flex flex-col gap-4",
        "sm:h-[216px] sm:flex sm:flex-row sm:gap-10 sm:w-full",
        "lg:w-full lg:flex lg:flex-col lg:gap-4 lg:h-fit",
        "xl:w-full  xl:h-[216px] xl:flex xl:flex-row xl:gap-10",
        className,
      )}
    >
      <PlacePicture sitter={sitter} priority={priority} />
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-2 max-w-[531px] max-h-[172px]">
        <PetSitterInfo sitter={sitter} />
        <LocationPetSitter sitter={sitter} />
        <TagPetType sitter={sitter} />
      </div>
    </Link>
  );
}
