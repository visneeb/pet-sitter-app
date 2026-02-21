import { PetSitter } from "@/hooks/usePetSitterData";
import PetSitterPicture from "./PetSitterPicture";
import RatingStar from "./RatingStar";

export default function PetSitterInfo({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex flex-row justify-start items-center gap-4">
      <PetSitterPicture sitter={sitter} />
      <div className="flex flex-col justify-start items-start flex-1 min-w-0">
        <div className="w-full flex flex-row justify-between items-start">
          <h3 className="style-headline-3 text-gray-800 leading-tight">
            {sitter.title}
          </h3>
          <RatingStar sitter={sitter} />
        </div>
        <p className="style-body-1 text-gray-500 font-medium">
          By {sitter.name}
        </p>
      </div>
    </div>
  );
}
