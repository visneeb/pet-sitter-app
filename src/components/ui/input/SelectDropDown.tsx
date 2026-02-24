import * as React from "react";
import { ChevronDown } from "lucide-react";
import cn from "@/utils/cn";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-lg border border-gray-300 px-4 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    );
  },
);

Select.displayName = "Select";
