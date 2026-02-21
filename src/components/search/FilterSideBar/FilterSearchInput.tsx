import { useCallback, useId } from "react";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="style-body-2">
        {label}
      </label>
      <div className="relative">
        <Input
          id={inputId}
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="h-12 w-full selection:bg-orange-200"
        />
        <Search
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
