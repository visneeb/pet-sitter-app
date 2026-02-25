"use client";

import { Input } from "@/components/form/index";
import { useFormContext, useWatch } from "react-hook-form";
import { Search } from "lucide-react";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
};

export function SearchInput({ name, label, placeholder }: Props) {
  const { control, setValue } = useFormContext();

  const value = useWatch({
    control,
    name,
  });

  const handleClear = () => {
    setValue(name, "");
  };

  return (
    <Input
      name={name}
      label={label}
      placeholder={placeholder}
      rightAction={
        value ? (
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            ✕
          </button>
        ) : (
          <Search className="w-4 h-4 text-gray-400" />
        )
      }
    />
  );
}
