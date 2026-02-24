"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";
import { useFormField } from "../form/FormField";

export function Password(
  props: React.ComponentPropsWithoutRef<"input">
) {
  const [show, setShow] = useState(false);
  const { id, error, disabled } = useFormField();

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        disabled={disabled}
        aria-invalid={error}
        className={cn(
          baseInputStyles,
          "pr-10",
          error && "border-red",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        {...props}
      />

      {!error && (
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
    </div>
  );
}