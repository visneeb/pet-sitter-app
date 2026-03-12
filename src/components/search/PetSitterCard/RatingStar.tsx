import { Star } from "lucide-react";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";

interface RatingStarProps {
  sitter: PetSitter;
  containerClassName?: string;
  starClassName?: string;
  colorStar?: string;
  colorFill?: string;
}


export default function RatingStar({
  sitter,
  containerClassName,
  starClassName,
  colorStar = "#1CCD83",
  colorFill = "#1CCD83",
}: Readonly<RatingStarProps>) {

  const sizeClass = starClassName ?? "w-3 h-3 sm:w-5 sm:h-5";
  return (
    <div className={cn("flex items-center gap-[2px] mt-2", containerClassName)}>
      {Array.from({ length: sitter.rating }).map((_, i) => (
        <Star
          key={i}
          color={colorStar}
          fill={colorFill}
          className={sizeClass}
        />
      ))}
    </div>
  );
}
