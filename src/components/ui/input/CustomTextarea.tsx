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
      className={cn(baseInputStyles, "min-h-20 resize-none p-3", className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
