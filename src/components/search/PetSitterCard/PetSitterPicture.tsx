import { PetSitter } from "@/hooks/usePetSitterData";
import Image from "next/image";

export default function PetSitterPicture({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <Image
      src={sitter.image}
      alt={sitter.name}
      width={64}
      height={64}
      className="w-16 h-16 aspect-4/3 object-cover rounded-full"
    />
  );
}
