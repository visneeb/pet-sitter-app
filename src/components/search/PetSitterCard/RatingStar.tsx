import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import IconStar from "../ui/IconStar";
import { Star } from "lucide-react";
import { useScreenContext } from "@/contexts/ScreenContext";

export default function RatingStar({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall } = useScreenContext();
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: sitter.rating }).map((_, i) => (
        <Star key={i} color="#1CCD83" fill="#1CCD83" size={isSmall ? 20 : 12} />
      ))}
    </div>
  );
}
