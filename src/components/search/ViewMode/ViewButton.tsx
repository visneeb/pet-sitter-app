"use client";

import { ViewMode } from "@/constants/viewMode";
import cn from "@/utils/cn";

const BASE_STYLE =
  "h-10 w-20 rounded-lg border transition hover:ring-4 shadow-sm";

const getButtonStyle = (isActive: boolean) =>
  cn(
    BASE_STYLE,
    isActive
      ? "border-orange-500 text-orange-500 hover:ring-orange-200"
      : "border-gray-300 text-gray-300 hover:ring-gray-200",
  );

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
  const isActive = currentView === mode;

  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      className={cn(getButtonStyle(isActive), "max-lg:w-[165px]")}
      aria-pressed={isActive}
      aria-label={`Switch to ${label} view`}
    >
      <span className="flex flex-row items-center justify-center gap-2">
        {icon}
        <span className="style-body-2">{label}</span>
      </span>
    </button>
  );
}
