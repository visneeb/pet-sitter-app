"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> & {
  error?: boolean;
  errorMessage?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <textarea
          ref={ref}
          aria-invalid={error}
          className={cn(
            baseInputStyles.replace("h-12", ""),
            "p-3 resize-none",
            error && "border-red pr-10 pb-10",
            className,
          )}
          {...props}
        />

        {error && (
          <div className="absolute bottom-4 right-3 z-10">
            <div className="relative">
              <AlertCircle size={18} className="text-red cursor-pointer" />

              {errorMessage && (
                <div className="absolute right-0  mb-2 w-max max-w-xs rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
