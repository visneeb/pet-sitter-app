"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input ref={ref} className={cn(baseInputStyles, className)} {...props} />
  );
});

Input.displayName = "Input";
