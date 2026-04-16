"use client";

import cn from "@/utils/cn";
import type { SearchMode } from "@/contexts/PetSitterSearchContext";

const DEFAULT_LOCATION_RADIUS_METERS = 5000;
const SEARCH_MODES: ReadonlyArray<{ value: SearchMode; label: string }> = [
  { value: "standard", label: "Default search" },
  { value: "location", label: "Near me" },
];

interface SearchModePanelProps {
  readonly searchMode: SearchMode;
  readonly geolocationStatus: "idle" | "loading" | "ready" | "error";
  readonly geolocationError: string | null;
  readonly currentSearchRadius: number | null;
  readonly canIncreaseSearchRadius: boolean;
  readonly onChangeMode: (mode: SearchMode) => Promise<void>;
  readonly onIncreaseRadius: () => void;
}

function getSearchStatusMessage({
  geolocationStatus,
  geolocationError,
  searchMode,
}: Pick<
  SearchModePanelProps,
  "geolocationStatus" | "geolocationError" | "searchMode"
>) {
  if (geolocationStatus === "loading") {
    return "Getting your location...";
  }

  if (geolocationError) {
    return geolocationError;
  }

  if (searchMode === "location") {
    return "Showing pet sitters near your current location. Map view will pin you automatically.";
  }

  return "Showing all matching pet sitters.";
}

export default function SearchModePanel({
  searchMode,
  geolocationStatus,
  geolocationError,
  currentSearchRadius,
  canIncreaseSearchRadius,
  onChangeMode,
  onIncreaseRadius,
}: Readonly<SearchModePanelProps>) {
  const activeModeIndex = Math.max(
    SEARCH_MODES.findIndex(({ value }) => value === searchMode),
    0,
  );

  return (
    <section
      aria-label="Search"
      className={cn("relative z-0 w-full overflow-hidden rounded-2xl")}
    >
      <article
        className={cn(
          "flex min-h-[52px] flex-col items-center justify-center gap-2 bg-white px-4 py-4 shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]",
        )}
      >
        <section className="w-full" aria-label="Search mode">
          <div className="relative grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/2)] rounded-full bg-white shadow transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                activeModeIndex === 0 ? "translate-x-0" : "translate-x-full",
              )}
            />
            {SEARCH_MODES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  void onChangeMode(value);
                }}
                disabled={geolocationStatus === "loading"}
                className={cn(
                  "relative z-10 rounded-full py-2 text-sm font-medium transition-colors duration-500 motion-reduce:transition-none",
                  "hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                  searchMode === value ? "text-orange-600" : "text-gray-500",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-500">
          {getSearchStatusMessage({ geolocationStatus, geolocationError, searchMode })}
        </p>

        {searchMode === "location" ? (
          <section className="flex w-full items-center justify-between gap-3 rounded-xl bg-orange-50 px-3 py-2">
            <p className="text-xs text-orange-700">
              Radius:{" "}
              <span className="font-semibold">
                {Math.round(
                  (currentSearchRadius ?? DEFAULT_LOCATION_RADIUS_METERS) / 1000,
                )}{" "}
                km
              </span>
            </p>
            <button
              type="button"
              onClick={onIncreaseRadius}
              disabled={geolocationStatus === "loading" || !canIncreaseSearchRadius}
              className={cn(
                "rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white transition-colors",
                "hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300",
              )}
            >
              Expand radius
            </button>
          </section>
        ) : null}
      </article>
    </section>
  );
}
