"use client";

import { ViewMode } from "@/constants/viewMode";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";


// --- Styles ---
const BASE_STYLE = "w-20 h-10 rounded-lg transition shadow- hover:ring-4";
const getButtonStyle = (isActive: boolean) =>
  `${BASE_STYLE} ${
    isActive
      ? "hover:ring-orange-200 text-orange-500 border border-orange-500"
      : "hover:ring-gray-200 text-gray-300 border border-gray-300"
  }`;

// --- Sub-Component ---
interface ViewButtonProps {
  mode: ViewMode;
  currentView: ViewMode;
  icon: React.ReactNode;
  label: string;
  onClick: (mode: ViewMode) => void;
}

export default function ViewButton({
  mode,
  currentView,
  icon,
  label,
  onClick,
}: ViewButtonProps) {
    const { isSmall, isMedium, isLarge } = useScreenContext();
  const isWebView = isSmall && isMedium && isLarge;
  return (
    <button
      onClick={() => onClick(mode)}
      className={cn(getButtonStyle(currentView === mode),!isWebView &&"w-[165px]")}
      aria-pressed={currentView === mode}
      aria-label={`Switch to ${label} view`}
    >
      <div className="flex flex-row gap-2 justify-center items-center">
        {icon}
        <span className="style-body-2">{label}</span>
      </div>
    </button>
  );
}
