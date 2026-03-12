import { ImageOff } from "lucide-react";
import Image from "next/image";
import { PetSitter } from "@/types/PetSittersType";
import cn from "@/utils/cn";

interface PicturePlaceProps {
  sitter: PetSitter;
  containerClassName?: string;
  imageClassName?: string;
}

export default function PicturePlace({ sitter, containerClassName, imageClassName }: PicturePlaceProps) {
  return (
    <div className={cn("w-[97px] h-[73px] sm:w-[144px] sm:h-[108px]", containerClassName)}>
      {sitter.imgUrl ? (
        <Image
          src={sitter.imgUrl}
          alt={sitter.tradeName}
          width={100}
          height={100}
          className={cn("rounded-lg object-cover w-full h-full", imageClassName)}
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-200 rounded-lg w-full h-full">
          <ImageOff className="text-white size-10 sm:size-12 lg:size-12" />
        </div>
      )}
    </div>
  );
}
