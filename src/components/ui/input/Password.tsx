"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input, InputProps } from "./Input";

export const Password = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        {...props}
        rightElement={
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        }
      />
    );
  },
);

Password.displayName = "Password";
