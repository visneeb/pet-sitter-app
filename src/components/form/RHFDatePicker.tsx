/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { formatDatePickerDisplay } from "@/utils/dateFormat";
import { FormField } from "../ui/form/FormField";
import { FormControl } from "../ui/form/FormControl";
import { FormDescription } from "../ui/form/FormDescription";
import { FormMessage } from "../ui/form/FormMessage";
import { Input } from "../ui/input/Input";
import cn from "@/utils/cn";

type RHFDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof DayPicker>,
  "mode" | "selected" | "onSelect"
>;

export function RHFDatePicker<T extends FieldValues>({
  name,
  label,
  required,
  description,
  placeholder,
  className,
  ...dayPickerProps
}: RHFDatePickerProps<T>) {
  const { control } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const rawValue = field.value as unknown;

        let valueAsDate: Date | undefined;

        if (typeof rawValue === "string" || typeof rawValue === "number") {
          const parsed = new Date(rawValue);
          valueAsDate = Number.isNaN(parsed.getTime()) ? undefined : parsed;
        } else {
          valueAsDate = rawValue as Date | undefined;
        }

        const formattedValue = formatDatePickerDisplay(valueAsDate);

        return (
          <FormField name={name}>
            <label htmlFor={label} className="style-label text-black">
              {label}
              {required && <span>*</span>}
            </label>

            <FormControl>
              <div
                ref={containerRef}
                className="relative w-full"
                onBlur={(event) => {
                  const relatedTarget = event.relatedTarget as Node | null;

                  if (
                    !relatedTarget ||
                    !event.currentTarget.contains(relatedTarget)
                  ) {
                    setIsOpen(false);
                  }
                }}
              >
                <Input
                  type="text"
                  id={label}
                  value={formattedValue}
                  placeholder={placeholder}
                  onFocus={() => setIsOpen(true)}
                  error={!!error}
                  readOnly
                />

                {isOpen && (
                  <div className={cn("absolute z-10 mt-2", className)}>
                    <DayPicker
                      fixedWeeks
                      showOutsideDays
                      mode="single"
                      navLayout="after"
                      captionLayout="dropdown"
                      selected={valueAsDate}
                      defaultMonth={valueAsDate}
                      onSelect={(date) => {
                        field.onChange(date ?? null);
                        setIsOpen(false);
                      }}
                      classNames={{
                        root: "rdp-root p-3 bg-white rounded-xl shadow-[0px_0px_12px_2px_rgba(0,0,0,0.16)]",
                        chevron: "size-4 fill-gray-400",
                        button_previous:
                          "rdp-button_previous hover:cursor-pointer",
                        button_next: "rdp-button_next hover:cursor-pointer",
                        month: "grid grid-cols-3",
                        month_caption: "col-span-2 mb-4.25",
                        months_dropdown: "style-body-3 text-black",
                        years_dropdown: "style-body-3 text-black",
                        caption_label: "hidden",
                        month_grid: "col-span-3",
                        nav: "flex justify-end gap-4.25 mb-4.25",
                        weekday: "style-body-3 text-gray-400 size-10",
                        day_button: "rdp-day_button size-10 rounded-full",
                        day: "style-body-3 text-gray-600",
                        today: "rdp-today bg-orange-300 rounded-full",
                        selected:
                          "rdp-selected bg-orange-500 text-white rounded-full",
                        outside: "text-gray-400!",
                      }}
                      {...dayPickerProps}
                    />
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

export default RHFDatePicker;
