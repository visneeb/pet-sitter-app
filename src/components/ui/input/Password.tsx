"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";
import cn from "@/utils/cn";
import * as React from "react";
import { ExclamationCircleIcon } from "@/assets/icons/components";
import "./Password.css";

type Props = React.ComponentPropsWithoutRef<typeof Input> & {
  hasError?: boolean;
};

export const Password = React.forwardRef<HTMLInputElement, Props>(
  ({ className, hasError, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          error={hasError}
          className={cn("pr-24", className)}
          {...props}
          autoComplete="new-password"
        />

        {/* Error icon */}
        {hasError && (
          <span className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              primaryColor="white"
              secondaryColor="red"
              size={18}
              className=" bg-red rounded-full"
            />
          </span>
        )}

        {/* Eye toggle */}
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-y-0 right-3 flex items-center justify-center w-9 text-gray-400 hover:text-gray-600 z-10"
          style={{ pointerEvents: "auto" }}
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    );
  },
);

Password.displayName = "Password";
