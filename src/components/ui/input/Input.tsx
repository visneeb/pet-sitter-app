"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

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
    const hasRight = !!rightElement || !!error;

    return (
      <div className="relative w-full group">
        <input
          ref={ref}
          type={type}
          aria-invalid={error}
          className={cn(
            baseInputStyles,
            "h-12",
            error && "border-red pr-10",
            hasRight && "pr-10",
            className,
          )}
          {...props}
        />

        {/* Custom Right Element */}
        {rightElement && !error && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="relative">
              <AlertCircle size={18} className="text-red cursor-pointer" />
            </div>
          </div>
        )}
        {errorMessage && (
          <div className=" text-red ransition-opacity pointer-events-none">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
