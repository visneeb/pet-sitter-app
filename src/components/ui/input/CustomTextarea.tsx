"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(baseInputStyles, "min-h-35 resize-none p-3 placeholder:text-gray-400 placeholder:font-normal placeholder:style-body-2", className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
