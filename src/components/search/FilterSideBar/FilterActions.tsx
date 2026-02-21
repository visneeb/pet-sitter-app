import { ActionButton } from "@/components/ui/Button";
interface FilterActionsProps {
  searchText: string;
  petTypes: string[];
  rating: number[];
  experience: string;
  onClear: () => void;
  onSearch: () => void;
}

export default function FilterActions({
  searchText,
  petTypes,
  rating,
  experience,
  onClear,
  onSearch,
}: FilterActionsProps) {
  const handleClear = () => {
    onClear();
  };

  const handleSearch = () => {
    onSearch();
  };
  return (
    <div className="flex flex-row gap-2 ">
      <ActionButton
        variant="secondary"
        className="w-41 h-12"
        onClick={handleClear}
      >
        Clear
      </ActionButton>
      <ActionButton
        variant="primary"
        className="w-41 h-12"
        onClick={handleSearch}
      >
        Search
      </ActionButton>
    </div>
  );
}
