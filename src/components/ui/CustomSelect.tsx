"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import cn from "@/utils/cn";

interface CustomSelectProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    if (onChange) {
      onChange(option);
    }
    if (!isControlled) {
      setInternalValue(option);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button" // Prevent form submission
        onClick={() => {
          if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const estimatedListHeight = 240; // max-h-60 = 15rem = 240px
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpward(spaceBelow < estimatedListHeight);
          }
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full p-2.5 flex justify-between items-center",
          "border border-gray-200 rounded-lg bg-white",
          "style-body-2 text-gray-600 text-left",
          "focus:outline-none transition-all duration-200",
          isOpen
            ? "ring-2 ring-orange-200 border-orange-400"
            : "hover:border-orange-400", // Add hover effect to trigger too if desired, matching user request 'style like above'
          className,
        )}
      >
        <span className={currentValue ? "text-gray-600" : "text-gray-400"}>
          {currentValue || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            isOpen && "transform rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            "absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none",
            openUpward ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={currentValue === option}
              tabIndex={0}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
              className={cn(
                "p-2.5 cursor-pointer style-body-2 text-gray-600 outline-none",
                "hover:bg-orange-100 hover:text-orange-600 transition-colors duration-150",
                "focus:bg-orange-100 focus:text-orange-600", // Add focus style same as hover
                currentValue === option && "bg-gray-100 text-orange-600",
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
