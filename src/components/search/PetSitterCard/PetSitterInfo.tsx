import PetSitterPicture from "./PetSitterPicture";
import RatingStar from "./RatingStar";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";

export default function PetSitterInfo({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex flex-row justify-start items-center gap-4">
      <PetSitterPicture sitter={sitter} />
      <div className="flex flex-col justify-start items-start flex-1 min-w-0">
        <div className="w-full flex flex-row justify-between items-start text-center">
          <h3
            className={cn(
              "text-gray-800 truncate",
              "style-body-1 text-start",
              "sm:style-headline-4",
              "xl:style-headline-3",
            )}
          >
            {sitter.tradeName}
          </h3>
          <RatingStar sitter={sitter} />
        </div>
        <p
          className={cn(
            "text-gray-500 truncate",
            "style-body-3",
            "sm:style-body-2",
            "xl:style-body-1",
          )}
        >
          By {sitter.sitter.name}
        </p>
      </div>
    </div>
  );
}
