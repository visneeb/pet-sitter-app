import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import PetSitterPicture from "./PetSitterPicture";
import RatingStar from "./RatingStar";
import cn from "@/utils/cn";

import { useScreenContext } from "@/contexts/ScreenContext";

export default function PetSitterInfo({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall } = useScreenContext();
  return (
    <div className="flex flex-row justify-start items-center gap-4">
      <PetSitterPicture sitter={sitter} />
      <div className="flex flex-col justify-start items-start flex-1 min-w-0">
        <div className="w-full flex flex-row justify-between items-center text-center">
          <h3
            className={cn(
              "text-gray-800",
              isSmall ? "style-headline-3 " : "style-body-1",
            )}
          >
            {sitter.title}
          </h3>
          <RatingStar sitter={sitter} />
        </div>
        <p className="style-body-1 text-gray-500">By {sitter.name}</p>
      </div>
    </div>
  );
}
