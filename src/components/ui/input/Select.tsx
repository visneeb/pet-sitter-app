"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { baseInputStyles } from "./inputStyle";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  children: React.ReactNode;
};

export function Select({
  value = "",
  onChange,
  placeholder = "Select...",
  disabled,
  className,
  hasError,
  children,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState("");

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

  const getSelectedText = () => {
    if (value === "" || value === null || value === undefined)
      return placeholder;

    const childrenArray = React.Children.toArray(children);
    const selectedOption = childrenArray.find((child) => {
      if (React.isValidElement(child) && child.type === "option") {
        const childValue = (child.props as { value: string | number }).value;
        return String(childValue) === String(value);
      }
      return false;
    });

    if (React.isValidElement(selectedOption)) {
      return (selectedOption.props as { children: React.ReactNode }).children;
    }

    return placeholder;
  };

  function handleSelect(val: string) {
    if (!onChange) return;
    onChange(val);
    setOpen(false);
  }
  const selectedText = getSelectedText();
  const isPlaceholder = selectedText === placeholder;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          baseInputStyles,
          "flex items-center justify-between text-left",
          disabled && "opacity-60 cursor-not-allowed",
          className,
        )}
      >
        <span
          className={cn(
            "style-body-2",
            isPlaceholder ? "text-gray-400!" : "text-gray-900! style-input",
          )}
        >
          {getSelectedText()}
        </span>
        <svg
          className={cn("w-4 h-4 transition-transform", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border border-orange-400 px-2 py-1 rounded-md style-input focus-visible:border-orange-500 focus-visible:outline-none"
            />
          </div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === "option") {
              const label = String((child.props as { children: React.ReactNode }).children).toLowerCase();
              if (!label.includes(search.toLowerCase())) return null;
              const childProps = child.props as {
                value: string;
                disabled?: boolean;
                children: React.ReactNode;
              };
              const selected = String(childProps.value) === String(value);
              const isDisabled = childProps.disabled;

              return (
                //  key added here
                <button
                  key={childProps.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(childProps.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-gray-600 style-input hover:bg-gray-100",
                    selected && "bg-gray-100",
                    isDisabled &&
                      "opacity-50 cursor-not-allowed hover:bg-transparent",
                  )}
                >
                  {childProps.children}
                </button>
              );
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}
