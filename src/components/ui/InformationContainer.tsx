import cn from "@/utils/cn";

function InformationContainer({
  title,
  detail,
  className,
}: {
  title: string;
  detail: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={title} className="flex w-full min-w-0 flex-col gap-1">
      <h4 className="style-headline-4 text-gray-300">{title}</h4>
      <span
        className={cn(
          "flex flex-col gap-1 style-input w-full min-w-0 text-black wrap-break-word whitespace-pre-wrap",
          className,
        )}
      >
        {detail}
      </span>
    </section>
  );
}

export default InformationContainer;
