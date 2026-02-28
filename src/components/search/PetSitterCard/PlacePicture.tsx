import Image from "next/image";

import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";
import { ImageOff } from "lucide-react";

export default function PlacePicture({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  const { isSmall } = useScreenContext();
  return (
    <div>
      {sitter.imgUrl ? (
        <Image
          src={sitter.imgUrl}
          alt={sitter.tradeName || "Place picture"}
          width={245}
          height={184}
          priority={priority}
          className={cn(
            "object-cover rounded-lg aspect-4/3",
            isSmall ? "w-full h-full" : "w-full h-[100px]",
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-200 rounded-lg aspect-4/3",
            isSmall ? "w-full h-full" : "w-full h-[100px]",
          )}
        >
          <ImageOff className="text-gray-400" size={32} />
        </div>
      )}
    </div>
  );
}
