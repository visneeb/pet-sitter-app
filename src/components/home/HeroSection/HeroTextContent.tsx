import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";

export function HeroTextContent() {
  const { isSmall, isMedium } = useScreenContext();
  const isWebView = isSmall && isMedium;
  return (
    <div className="flex flex-col justify-center items-center">
      <h1
        className={cn(
          "text-black ",
          isWebView ? "style-display" : "style-headline-1",
        )}
      >
        Pet Sitter<span className="text-orange-500">,</span>
      </h1>
      <h1
        className={cn(
          "text-black ",
          isWebView ? "style-display" : "style-headline-1",
        )}
      >
        Perfect<span className="text-blue-500">,</span>
      </h1>
      <h1
        className={cn(
          "text-black ",
          isWebView ? "style-display" : "style-headline-1",
        )}
      >
        For Your Pet<span className="text-yellow-200">.</span>
      </h1>
      <p
        className={cn(
          "text-gray-400 ",
          isWebView ? "style-headline-3 mt-[32px]" : "style-headline-4 mt-[24px]",
        )}
      >
        Find your perfect pet sitter with us.
      </p>
    </div>
  );
}
