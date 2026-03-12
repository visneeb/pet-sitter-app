import { PetSitter } from "@/types/PetSittersType";
import cn from "@/utils/cn";
import Image from "next/image";
import { ImageOff, UserRound } from "lucide-react";

export default function PetSitterPicture({
  sitter,
  className,
}: Readonly<{ sitter: PetSitter; className?: string }>) {
  const sizeClass = cn("w-9 h-9 sm:w-16 sm:h-16", className);
  if (!sitter.sitter.profileImgUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 rounded-full",
          sizeClass,
        )}
      >
        <UserRound className="size-6 sm:size-8 lg:size-10 text-white" />
      </div>
    );
  }

  return (
    <Image
      src={sitter.sitter.profileImgUrl}
      alt={sitter.tradeName || "Pet sitter picture"}
      width={64}
      height={64}
      className={cn("aspect-4/3 object-cover rounded-full", sizeClass)}
    />
  );
}
