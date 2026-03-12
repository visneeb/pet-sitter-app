import cn from "@/utils/cn";

function Bone({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("bg-gray-200 rounded-md animate-pulse", className)} />
  );
}

export default function PetSitterCardSkeleton() {
  return (
    <div
      className={cn(
        "p-4 justify-start rounded-xl overflow-hidden shadow-md border border-gray-100",
        "w-[335px] min-w-[335px] flex flex-col gap-4",
        "sm:h-[216px] sm:flex sm:flex-row sm:gap-10 sm:w-full",
        "lg:w-full lg:flex lg:flex-col lg:gap-4 lg:h-fit",
        "xl:w-full  xl:h-[216px] xl:flex xl:flex-row xl:gap-10",
      )}
    >
      {/* Image placeholder */}
      <Bone
        className={cn(
          "rounded-lg shrink-0",
          "w-full h-[100px]",
          "sm:w-[245px] sm:h-[184px]",
          "lg:w-full lg:h-[184px]",
          "xl:w-[245px] xl:h-[184px]",
        )}
      />

      {/* Info section */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-2 max-w-[531px] max-h-[172px]">
        {/* Name + rating */}
        <div className="flex flex-col gap-2 mt-1">
          <Bone className="h-6 w-3/4 max-w-[200px]" />
          <Bone className="h-4 w-1/2 max-w-[120px]" />
        </div>

        {/* Location */}
        <Bone className="h-4 w-2/3 max-w-[160px]" />

        {/* Tags */}
        <div className="flex gap-2">
          <Bone className="h-[26px] w-[70px] rounded-full" />
          <Bone className="h-[26px] w-[60px] rounded-full" />
          <Bone className="h-[26px] w-[80px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
