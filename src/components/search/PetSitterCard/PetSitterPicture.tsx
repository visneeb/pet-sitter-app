import { useScreenContext } from "@/contexts/ScreenContext";
import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import cn from "@/utils/cn";
import Image from "next/image";

export default function PetSitterPicture({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const {isSmall}=useScreenContext();
  return (
    <Image
      src={sitter.image}
      alt={sitter.name}
      width={64}
      height={64}
      className={cn("aspect-4/3 object-cover rounded-full",isSmall ? "w-16 h-16":"w-9 h-9")}
    />
  );
}
