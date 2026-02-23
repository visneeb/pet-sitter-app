import { PetSitter } from "@/hooks/PetSitterPage/usePetSitterData";
import IconStar from "../ui/IconStar";

export default function RatingStar({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: sitter.rating }).map((_, i) => (
        <IconStar key={i} filled={i < sitter.rating} />
      ))}
    </div>
  );
}
