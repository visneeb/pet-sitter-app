import Image from "next/image";

import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";
import { ImageOff, UserRound } from "lucide-react";

export default function PlacePicture({
  sitter,
  priority = false,
  className,
}: Readonly<{ sitter: PetSitter; priority?: boolean; className?: string }>) {
  const sizeClass = cn(
    "object-cover rounded-lg aspect-4/3",
    "w-full h-[100px]",
    "sm:w-[245px] sm:h-[184px]",
    "lg:w-full lg:h-[184px]",
    "xl:w-[245px] xl:h-[184px]",
    className,
  );
  return (
    <div>
      {sitter.imgUrl ? (
        <Image
          src={sitter.imgUrl}
          alt={sitter.tradeName || "Place picture"}
          width={245}
          height={184}
          priority={priority}
          className={sizeClass}
        />
      ) : (
        <div
          className={cn(
            sizeClass,
            "flex items-center justify-center bg-gray-200",
          )}
        >
          <ImageOff className="text-white size-10 sm:size-15 lg:size-15"/>
        </div>
      )}
    </div>
  );
}
