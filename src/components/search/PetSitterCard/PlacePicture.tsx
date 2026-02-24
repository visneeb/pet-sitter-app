import Image from "next/image";
import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";

export default function PlacePicture({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  const { isSmall } = useScreenContext();
  return (
    <div>
      <Image
        src={sitter.image}
        alt={sitter.name}
        width={245}
        height={184}
        priority={priority}
        className={cn(
          "object-cover rounded-lg aspect-4/3",
          isSmall ? "w-full h-[100px]" : "w-full h-[100px]",
        )}
      />
    </div>
  );
}
