"use client";

import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import FilterSideBar from "@/components/search/FilterSideBar";
import MainViewSearch from "@/components/search/MainViewSearch";
import SearchModePanel from "@/components/search/SearchModePanel";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import { Pagination } from "@/components/ui/Pagination";
import { useSearchParams } from "next/navigation";
import { ActionButton } from "../ui/Button";
import { ChevronUp } from "lucide-react";

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
            <SearchModePanel
              searchMode={searchMode}
              geolocationStatus={geolocationStatus}
              geolocationError={geolocationError}
              currentSearchRadius={currentSearchRadius}
              canIncreaseSearchRadius={canIncreaseSearchRadius}
              onChangeMode={handleSearchModeChange}
              onIncreaseRadius={handleIncreaseSearchRadius}
            />
          </div>

          <div className="block lg:hidden mt-10 mb-6">
            <HeaderSearchViewMode />
          </div>
          <div className="order-3 lg:order-2 w-full flex justify-center items-start">
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
