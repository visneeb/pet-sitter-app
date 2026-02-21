import Image from "next/image";
import { PetSitter } from "@/hooks/usePetSitterData";

export default function PlacePicture({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div>
      <Image
        src={sitter.image}
        alt={sitter.name}
        width={245}
        height={184}
        className="w-[245px] h-[184px] aspect-4/3 object-cover rounded-lg"
      />
    </div>
  );
}
