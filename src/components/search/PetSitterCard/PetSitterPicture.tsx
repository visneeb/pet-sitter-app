import { useScreenContext } from "@/contexts/ScreenContext";
import { PetSitter } from "@/types/PetSittersType";
import cn from "@/utils/cn";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function PetSitterPicture({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall, isMedium, isLarge, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium;
  const isWebViewMini = isLarge && !isXLarge;

  const sizeClass = isWebView
    ? isWebViewMini
      ? "w-9 h-9"
      : "w-16 h-16"
    : "w-9 h-9";

  if (!sitter.imgUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 rounded-full",
          sizeClass,
        )}
      >
        <ImageOff className="text-gray-400" size={16} />
      </div>
    );
  }

  return (
    <Image
      src={sitter.imgUrl}
      alt={sitter.tradeName || "Pet sitter picture"}
      width={64}
      height={64}
      className={cn("aspect-4/3 object-cover rounded-full", sizeClass)}
    />
  );
}
