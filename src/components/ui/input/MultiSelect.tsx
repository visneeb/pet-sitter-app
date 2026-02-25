"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

export type MultiSelectOption = {
  label: string;
  value: string;
};

type Props = {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean; // Add error prop
};

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled,
  className,
  hasError,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // close when click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleValue(val: string) {
    if (!onChange) return;

    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          baseInputStyles,
          "flex flex-wrap items-center gap-1 text-left",
          disabled && "opacity-60 cursor-not-allowed",
          className,
        )}
      >
        {value.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}

        {value.map((val) => {
          const option = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className={cn(
                "style-body-3 rounded-full px-4 py-1 text-orange-600 bg-orange-100 hover:bg-orange-200",
                hasError && "border-red bg-red-50 text-red-700", // Use hasError prop
              )}
            >
              {option?.label}
            </span>
          );
        })}
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-60 overflow-auto">
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleValue(option.value)}
                className={cn(
                  "w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100",
                  selected && "bg-gray-100",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
