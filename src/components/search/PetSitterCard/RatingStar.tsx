import { Star } from "lucide-react";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import { PetSitter } from "@/types/PetSittersType";

export default function RatingStar({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall, isMedium, isLarge, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium;
  const isWebViewMini = isLarge && !isXLarge;
  return (
    <div className={cn("flex items-center gap-[2px] mt-2")}>
      {Array.from({ length: sitter.rating }).map((_, i) => (
        <Star
          key={i}
          color="#1CCD83"
          fill="#1CCD83"
          size={isWebView ? (isWebViewMini ? 12 : 20) : 12}
        />
      ))}
    </div>
  );
}
