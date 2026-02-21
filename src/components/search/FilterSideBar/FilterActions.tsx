import { ActionButton } from "@/components/ui/Button";

export default function FilterActions() {
    return (
        <div className="flex flex-row gap-2 ">
        <ActionButton variant="secondary" className="w-41 h-12">
          Clear
        </ActionButton>
        <ActionButton variant="primary" className="w-41 h-12">
          Search
        </ActionButton>
      </div>
    );
}