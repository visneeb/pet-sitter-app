function Bone({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={`bg-gray-200 rounded-md animate-pulse ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function ReviewCardSkeleton({
  isLast = false,
}: {
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 md:px-6 pt-6 pb-10 ${
        isLast ? "" : "border-b border-gray-200"
      }`}
    >
      <div className="flex justify-between md:justify-start w-full md:w-[220px] shrink-0">
        <div className="flex gap-4">
          <Bone className="rounded-full w-[56px] h-[56px] shrink-0" />
          <div className="flex flex-col gap-2">
            <Bone className="h-5 w-24" />
            <Bone className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:max-w-[516px]">
        <div className="flex gap-[2px]">
          <Bone className="h-5 w-5 rounded-sm" />
          <Bone className="h-5 w-5 rounded-sm" />
          <Bone className="h-5 w-5 rounded-sm" />
        </div>
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
