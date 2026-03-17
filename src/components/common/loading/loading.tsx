import cn from "@/utils/cn";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-[300px] flex flex-col justify-center items-center",
        className,
      )}
    >
      <span className="loading loading-spinner loading-xl text-gray-600" />
    </div>
  );
}
