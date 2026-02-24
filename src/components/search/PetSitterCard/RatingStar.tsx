import { PetSitter } from "@/hooks/pet-sitter-page/usePetSitterData";
import IconStar from "../ui/IconStar";
import { Star } from "lucide-react";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";

export default function RatingStar({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall, isMedium } = useScreenContext();
  const isWebView = isSmall && isMedium;
  return (
    <div
      className={cn("flex items-center gap-[2px]", !isWebView && "mt-2")}
    >
      {Array.from({ length: sitter.rating }).map((_, i) => (
        <Star
          key={i}
          color="#1CCD83"
          fill="#1CCD83"
          size={isWebView ? 20 : 12}
        />
      ))}
    </div>
  );
}
