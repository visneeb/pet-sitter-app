
import PetSitterPicture from "./PetSitterPicture";
import RatingStar from "./RatingStar";
import cn from "@/utils/cn";

import { useScreenContext } from "@/contexts/ScreenContext";
import { PetSitter } from "@/types/PetSittersType";

export default function PetSitterInfo({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  const { isSmall, isMedium, isLarge, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium;
  const isWebViewMini = isLarge && !isXLarge;
  return (
    <div className="flex flex-row justify-start items-center gap-4">
      <PetSitterPicture sitter={sitter} />
      <div className="flex flex-col justify-start items-start flex-1 min-w-0">
        <div className="w-full flex flex-row justify-between items-start text-center">
          <h3
            className={cn(
              "text-gray-800",
              isWebView
                ? isWebViewMini
                  ? "style-body-1 text-start"
                  : "style-headline-3"
                : "style-body-1 text-start",
            )}
          >
            {sitter.tradeName}
          </h3>
          <RatingStar sitter={sitter} />
        </div>
        <p
          className={cn(
            "text-gray-500",
            isWebView
              ? isWebViewMini
                ? "style-body-3"
                : "style-body-1"
              : "style-body-3",
          )}
        >
          By {sitter.sitter[0]}
        </p>
      </div>
    </div>
  );
}
