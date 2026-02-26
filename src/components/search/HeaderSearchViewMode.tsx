"use client";

import { List, Map } from "lucide-react";
import ViewButton from "./ViewMode/ViewButton";
import { useViewMode } from "@/hooks/pet-sitter-page/useViewMode";
import cn from "@/utils/cn";
import { useScreenContext } from "@/contexts/ScreenContext";

// --- Main Component ---
export default function HeaderSearchViewMode() {
  const { currentView, changeView } = useViewMode();
  const { isSmall, isMedium, isLarge } = useScreenContext();
  const isWebView = isSmall && isMedium && isLarge;
  return (
    <header
      className={cn(
        isWebView
          ? `flex flex-row justify-between items-center w-full h-22 px-[92px] `
          : `flex flex-col justify-center items-center w-full gap-3`,
      )}
    >
      <h3
        className={`text-gray-600 ${isSmall ? "style-headline-3" : "style-headline-4"}`}
      >
        Search For Pet Sitter
      </h3>
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
