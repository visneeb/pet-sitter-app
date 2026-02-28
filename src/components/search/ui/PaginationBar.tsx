import { useViewMode } from "@/hooks/pet-sitter-page/useViewMode";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationBar = () => {
  const { currentView } = useViewMode();
  return (
    currentView === "list" && (
      <div className="w-full flex justify-center pt-6 pb-[196px]">
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 ">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition">
            <ChevronLeft />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 font-medium text-sm transition">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 font-medium text-sm transition">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 font-medium text-sm transition">
            4
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition">
            <ChevronRight />
          </button>
        </div>
      </div>
    )
  );
};
