"use client";

import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import FilterSideBar from "@/components/search/FilterSideBar";
import MainViewSearch from "@/components/search/MainViewSearch";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import { Pagination } from "@/components/ui/Pagination";
import { useSearchParams } from "next/navigation";
import { ActionButton } from "../ui/Button";
import { ChevronUp } from "lucide-react";
import cn from "@/utils/cn";

// ── Layout Constants ────────────────────────────────────────
// รวม magic values ไว้ที่เดียว → แก้ไขง่าย สอดคล้องกับ design system
const LAYOUT = {
  pageMaxWidth: "max-w-[1440px]",
  desktopSidePadding: "lg:px-[92px]",
  contentGap: "gap-6",
  sidebarGap: "lg:gap-9",
} as const;

export default function SearchPageContent() {
  const {
    currentPage,
    totalPages,
    handlePageChange,
    searchMode,
    handleSearchModeChange,
    geolocationStatus,
    geolocationError,
    currentSearchRadius,
    canIncreaseSearchRadius,
    handleIncreaseSearchRadius,
  } = usePetSitterSearch();
  const searchParams = useSearchParams();
  // Read directly from URL. Default to 'list' if not found.
  const viewMode = searchParams?.get("view") || "list";

  const searchModes = [
    { value: "standard", label: "Default search" },
    { value: "location", label: "Near me" },
  ] as const;
  const activeSearchModeIndex = Math.max(
    searchModes.findIndex(({ value }) => value === searchMode),
    0,
  );

  return (
    <>
      {/* ── Content Container ── */}
      <div
        className={`w-full ${LAYOUT.pageMaxWidth} self-center flex flex-col ${LAYOUT.contentGap} px-4 lg:px-0`}
      >
        <div className="hidden lg:block order-2 lg:order-1">
          <HeaderSearchViewMode />
        </div>

        <div
          id="main-content"
          className={`order-1 lg:order-2 flex flex-col items-center lg:flex-row lg:items-stretch justify-center ${LAYOUT.desktopSidePadding} ${LAYOUT.sidebarGap}`}
        >
          <div
            className="flex flex-col items-center justify-center lg:justify-start gap-3 lg:min-h-0 lg:h-fit lg:self-start lg:sticky lg:top-30"
          >
            <FilterSideBar />
            <section
              aria-label="Search"
              className={cn(
                "relative z-0 w-full overflow-hidden rounded-2xl",
              )}
            >
              <div
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-2 bg-white px-4 py-4 shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]",
                )}
              >
                <section className="w-full" aria-label="Search mode">
                  <div className="relative grid w-full grid-cols-2 rounded-full bg-gray-100 p-1 ">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full bg-white shadow transition-transform duration-300 ease-in-out motion-reduce:transition-none"
                      style={{
                        width: `calc((100% - 0.5rem) / ${searchModes.length})`,
                        transform: `translateX(${activeSearchModeIndex * 100}%)`,
                      }}
                    />
                    {searchModes.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          void handleSearchModeChange(value);
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
                  {geolocationStatus === "loading"
                    ? "Getting your location..."
                    : geolocationError
                      ? geolocationError
                      : searchMode === "location"
                        ? "Showing pet sitters near your current location."
                        : "Showing all matching pet sitters."}
                </p>
                {searchMode === "location" ? (
                  <div className="w-full flex items-center justify-between gap-3 rounded-xl bg-orange-50 px-3 py-2">
                    <p className="text-xs text-orange-700">
                      Radius:{" "}
                      <span className="font-semibold">
                        {Math.round((currentSearchRadius ?? 5000) / 1000)} km
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={handleIncreaseSearchRadius}
                      disabled={
                        geolocationStatus === "loading" || !canIncreaseSearchRadius
                      }
                      className={cn(
                        "rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white transition-colors",
                        "hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300",
                      )}
                    >
                      Expand radius
                    </button>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <div className="block lg:hidden mt-10 mb-6">
            <HeaderSearchViewMode />
          </div>
          <div className="order-3 lg:order-2 w-full flex justify-center items-center">
            <MainViewSearch />
          </div>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center pt-6 pb-6 sm:pb-[196px]">
        {/* ── Pagination ── */}
        {viewMode === "list" ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className=""
          />
        ) : (
          <div className="w-full flex justify-center"></div>
        )}
        <div className="w-full flex sm:hidden justify-end items-center pr-4 pb-4">
          <ActionButton
            variant="icon"
            onClick={() => {
              const mainContent = document.getElementById("main-content");
              if (mainContent) {
                mainContent.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ChevronUp />
          </ActionButton>
        </div>
      </div>
    </>
  );
}
