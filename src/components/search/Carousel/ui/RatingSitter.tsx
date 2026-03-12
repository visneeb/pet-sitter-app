import { PetSitter } from "@/types/PetSittersType";
import RatingStar from "../../PetSitterCard/RatingStar";
import cn from "@/utils/cn";

interface RatingSitterProps {
  starRating: number;
  containerClassName?: string;
  starClassName?: string;
}

export default function RatingSitter({
  starRating,
  containerClassName,
  starClassName,
}: RatingSitterProps) {
  return (
    <div
      className={cn(
        "flex flex-row justify-start items-start",
        containerClassName,
      )}
    >
      <RatingStar
        sitter={{ rating: starRating } as PetSitter}
        starClassName={starClassName ?? "w-[14px] h-[14px]"}
        containerClassName="mt-1 sm:mt-1"
      />
    </div>
  );
}
