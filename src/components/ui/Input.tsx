import * as React from "react";
import cn from "@/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "style-input text-black bg-white rounded-lg border border-gray-200 px-3 h-12",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground transition-[color,box-shadow] outline-none",
        "focus-visible:border focus-visible:border-orange-500",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-200",
        "aria-invalid:border-red",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
