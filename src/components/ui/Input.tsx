import cn from "@/utils/cn";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-headline-2  text-black bg-white rounded-lg border border-gray-200 px-3",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground transition-[color,box-shadow] outline-none ",
        "focus-visible:border  focus-visible:border-orange-500",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-200",
        "aria-invalid:border-red",
        className,
      )}
      {...props}
    />
  );
}
