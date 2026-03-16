"use client";

import { List, Map } from "lucide-react";
import ViewButton from "./ViewMode/ViewButton";
import { useViewMode } from "@/hooks/search/search-view/useViewMode";
import cn from "@/utils/cn";

export default function HeaderSearchViewMode() {
  const { currentView, changeView } = useViewMode();

  return (
    <header
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3",
        "lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-[92px]"
      )}
    >
      <h3 className="style-headline-4 text-gray-600 sm:style-headline-3">
        Search For Pet Sitter
      </h3>

      <nav aria-label="View mode" className="flex flex-row gap-3">
        <ViewButton
          mode="list"
          currentView={currentView}
          icon={<List aria-hidden="true" />}
          label="List"
          onClick={changeView}
        />
        <ViewButton
          mode="map"
          currentView={currentView}
          icon={<Map aria-hidden="true" />}
          label="Map"
          onClick={changeView}
        />
      </nav>
    </header>
  );
}