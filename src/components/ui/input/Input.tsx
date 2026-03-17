"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  error?: string | boolean;
  rightAction?: React.ReactNode;
  parentClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, rightAction, parentClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", parentClassName)}>
        <input
          ref={ref}
          className={cn(
            baseInputStyles,
            error && "border-red",
            rightAction && "pr-10",
            cn("w-full", className),
          )}
          {...props}
        />

        {rightAction && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightAction}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
