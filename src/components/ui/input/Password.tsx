"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import cn from "@/utils/cn";
import { Input, InputProps } from "./Input";

export const Password = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const hasError = Boolean((props as any).error);

    return (
      <div className="relative h-full w-full">
        <div>
          <Input
            ref={ref}
            type={show ? "text" : "password"}
            className={cn("pr-10", className)}
            {...props}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className={cn(
              "absolute inset-y-0 flex items-center text-gray-400 hover:text-gray-600",
              hasError ? "right-10" : "right-3",
            )}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>
    );
  },
);

Password.displayName = "Password";