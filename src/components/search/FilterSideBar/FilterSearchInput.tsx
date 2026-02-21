import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

export default function FilterSearchInput() {
  return (
    <div className="flex flex-col gap-2  ">
      <label htmlFor="search-pet-sitter" className="style-body-2 ">
        Search
      </label>
      <div className="relative">
        <Input
          id="search-pet-sitter"
          type="text"
          placeholder="Place Holder"
          className="h-12 w-full selection:bg-orange-200"
        ></Input>
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
