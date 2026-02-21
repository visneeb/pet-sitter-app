import { PetSitter } from "@/hooks/usePetSitterData";
import IconStar from "../ui/IconStar";

export default function RatingStar({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar key={i} filled={i < sitter.rating} />
      ))}
    </div>
  );
}
