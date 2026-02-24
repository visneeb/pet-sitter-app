import { useCallback, useId } from "react";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useScreenContext } from "@/contexts/ScreenContext";

interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function FilterSearchInput({
  searchText,
  onSearchChange,
  placeholder = "Search pet sitter...",
  label = "Search",
}: FilterSearchInputProps) {
  const inputId = useId();
  const { isSmall } = useScreenContext();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  const handleCancelChange = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="style-body-2">
        {label}
      </label>
      <Input
        id={inputId}
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="h-12 w-full selection:bg-orange-200"
        rightElement={
          searchText.length === 0 ? (
            <Search aria-hidden="true" className="text-gray-300" />
          ) : (
            <button
              onClick={handleCancelChange}
              className="p-1 text-gray-300 rounded-full hover:bg-gray-100"
            >
              <X />
            </button>
          )
        }
      />
    </div>
  );
}
