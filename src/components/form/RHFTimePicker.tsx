"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import {
  format24hTo12h,
  generateTimeOptions,
  type TimeOption,
} from "@/utils/timeFormat";
import { FormControl } from "../ui/form/FormControl";
import { FormDescription } from "../ui/form/FormDescription";
import { FormField } from "../ui/form/FormField";
import { FormMessage } from "../ui/form/FormMessage";
import { Input } from "../ui/input/Input";
import cn from "@/utils/cn";

type RHFTimePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  stepMinutes?: number;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  className?: string;
};

export function RHFTimePicker<T extends FieldValues>({
  name,
  label,
  required,
  description,
  placeholder = "Select time",
  stepMinutes = 30,
  minTime,
  maxTime,
  disabled = false,
  className,
}: RHFTimePickerProps<T>) {
  const { control } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const listboxId = `time-listbox-${name}`;
  const optionId = (i: number) => `time-option-${name}-${i}`;

  const timeOptions = useMemo(() => {
    const options = generateTimeOptions(stepMinutes);
    if (!minTime && !maxTime) return options;
    return options.filter((opt) => {
      if (minTime && opt.value < minTime) return false;
      if (maxTime && opt.value > maxTime) return false;
      return true;
    });
  }, [stepMinutes, minTime, maxTime]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setFocusedIndex(-1);
  }, [isOpen]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, [disabled]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = document.getElementById(`time-option-${name}-${index}`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [name]
  );

  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      scrollToIndex(focusedIndex);
    }
  }, [isOpen, focusedIndex, scrollToIndex]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    fieldValue: string | undefined,
    onChange: (v: string) => void
  ) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        const idx = timeOptions.findIndex((o) => o.value === fieldValue);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) =>
          i < timeOptions.length - 1 ? i + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) =>
          i > 0 ? i - 1 : timeOptions.length - 1
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && timeOptions[focusedIndex]) {
          onChange(timeOptions[focusedIndex].value);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(timeOptions.length - 1);
        break;
      default:
        break;
    }
  };

  const handleSelect = (
    opt: TimeOption,
    onChange: (v: string) => void
  ) => {
    onChange(opt.value);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label ?? name} is required` : false }}
      render={({ field, fieldState: { error } }) => {
        const value = field.value as string | undefined;
        const displayValue = format24hTo12h(value ?? "");

        return (
          <FormField name={name}>
            {label && (
              <label
                htmlFor={`${name}-input`}
                className="style-label text-black"
              >
                {label}
                {required && <span>*</span>}
              </label>
            )}

            <FormControl>
              <div
                ref={containerRef}
                className={cn("relative w-full", className)}
              >
                <Input
                  type="text"
                  id={`${name}-input`}
                  value={displayValue}
                  placeholder={placeholder}
                  readOnly
                  disabled={disabled}
                  error={!!error}
                  onFocus={() => {
                    if (disabled) return;
                    setIsOpen(true);
                    const idx = timeOptions.findIndex((o) => o.value === value);
                    setFocusedIndex(idx >= 0 ? idx : 0);
                  }}
                  onMouseDown={() => {
                    if (disabled) return;
                    setIsOpen((o) => {
                      if (!o) {
                        const idx = timeOptions.findIndex((o2) => o2.value === value);
                        setFocusedIndex(idx >= 0 ? idx : 0);
                      }
                      return !o;
                    });
                  }}
                  onKeyDown={(e) => handleKeyDown(e, value, field.onChange)}
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                />

                {isOpen && !disabled && (
                  <div
                    ref={listboxRef}
                    id={listboxId}
                    role="listbox"
                    aria-activedescendant={
                      focusedIndex >= 0 ? optionId(focusedIndex) : undefined
                    }
                    tabIndex={-1}
                    className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-[0px_0px_12px_2px_rgba(0,0,0,0.16)] p-2 max-h-60 overflow-y-auto"
                  >
                    {timeOptions.map((opt, i) => {
                      const isSelected = opt.value === value;
                      const isFocused = i === focusedIndex;
                      return (
                        <button
                          key={opt.value}
                          id={optionId(i)}
                          role="option"
                          aria-selected={isSelected}
                          type="button"
                          className={cn(
                            "w-full text-left px-3 py-2 style-body-2 text-black border-b border-gray-100 last:border-b-0 rounded transition-colors",
                            "hover:bg-gray-100 focus:outline-none focus:bg-gray-100",
                            (isSelected || isFocused) && "bg-gray-100"
                          )}
                          onMouseEnter={() => setFocusedIndex(i)}
                          onClick={() => handleSelect(opt, field.onChange)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}

            <FormMessage />
          </FormField>
        );
      }}
    />
  );
}

export default RHFTimePicker;
