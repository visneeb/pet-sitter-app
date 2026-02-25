import cn from "@/utils/cn";
import { useScreenContext } from "@/contexts/ScreenContext";

function Bone({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("bg-gray-200 rounded-md animate-pulse", className)} />
  );
}

export default function PetSitterCardSkeleton() {
  const { isSmall, isMedium, isLarge, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium;
  const isWebViewMini = isLarge && !isXLarge;

  return (
    <div
      className={cn(
        "p-4 justify-start rounded-xl overflow-hidden shadow-md border border-gray-100",
        isWebView
          ? isWebViewMini
            ? "w-full max-w-[355px]"
            : "h-54 flex flex-row gap-10 w-full"
          : "w-[335px] min-w-[335px] min-h-[268px] flex flex-col gap-4",
      )}
    >
      {/* Image placeholder */}
      <Bone
        className={cn(
          "rounded-lg shrink-0",
          isWebView && !isWebViewMini ? "w-[180px] h-full" : "w-full h-[160px]",
        )}
      />

      {/* Info section */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-2">
        {/* Name + rating */}
        <div className="flex flex-col gap-2">
          <Bone className="h-5 w-3/4" />
          <Bone className="h-4 w-1/2" />
        </div>

        {/* Location */}
        <Bone className="h-4 w-2/3" />

        {/* Tags */}
        <div className="flex gap-2">
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
