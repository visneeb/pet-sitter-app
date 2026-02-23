"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import cn from "@/utils/cn";

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  error?: boolean;
  errorMessage?: string;
  rightElement?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", error, errorMessage, rightElement, ...props },
    ref,
  ) => {
    return (
      <div className="relative w-full h-full group">
        <input
          ref={ref}
          type={type}
          aria-invalid={error}
          data-slot="input"
          className={cn(
            "w-full style-input text-black bg-white rounded-lg border border-gray-200 px-3 h-12",
            "transition-[color,box-shadow] outline-none",
            "focus-visible:border focus-visible:border-orange-500",
            error && "border-color-red pr-10",
            className,
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        )}

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500 cursor-pointer" />

            {errorMessage && (
              <div className="absolute right w-max max-w-xs rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
