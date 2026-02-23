"use client";

import { List, Map } from "lucide-react";
import ViewButton from "./ViewMode/ViewButton";
import { useViewMode } from "@/hooks/PetSitterPage/useViewMode";

// --- Main Component ---
export default function HeaderSearchViewMode() {
  const { currentView, changeView } = useViewMode();

  return (
    <header className="flex flex-row justify-between items-center w-full h-22 px-[92px]">
      <h3 className="style-headline-3">Search For Pet Sitter</h3>
      <div className="flex flex-row gap-3">
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
      </div>
    </header>
  );
}
