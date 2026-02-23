import Image from "next/image";
import { PetSitter } from "@/hooks/PetSitterPage/usePetSitterData";

export default function PlacePicture({
  sitter,
  priority = false,
}: Readonly<{ sitter: PetSitter; priority?: boolean }>) {
  return (
    <div>
      <Image
        src={sitter.image}
        alt={sitter.name}
        width={245}
        height={184}
        priority={priority}
        className="w-[245px] h-[184px] aspect-4/3 object-cover rounded-lg"
      />
    </div>
  );
}
