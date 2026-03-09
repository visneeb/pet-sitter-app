import { ActionButton } from "@/components/ui/Button";

type FilterActionsProps = {
  /**
   * Optional click handlers for non-form usage.
   * When rendered inside a <form>, prefer using type="reset"/"submit"
   * and handle behavior via the form's onReset/onSubmit.
   */
  onClear?: () => void;
  onSearch?: () => void;
};

export default function FilterActions({ onClear, onSearch }: FilterActionsProps) {
  return (
    <div className="flex flex-row gap-2 ">
      <ActionButton
        type="reset"
        variant="secondary"
        className="w-41 h-12"
        onClick={onClear}
      >
        Clear
      </ActionButton>
      <ActionButton
        type="submit"
        variant="primary"
        className="w-41 h-12"
        onClick={onSearch}
      >
        Search
      </ActionButton>
    </div>
  );
}
