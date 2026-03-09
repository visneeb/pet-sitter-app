"use client";

import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import FilterSideBar from "@/components/search/FilterSideBar";
import MainViewSearch from "@/components/search/MainViewSearch";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import { Pagination } from "@/components/ui/Pagination";
import { useSearchParams } from "next/navigation";

// ── Layout Constants ────────────────────────────────────────
// รวม magic values ไว้ที่เดียว → แก้ไขง่าย สอดคล้องกับ design system
const LAYOUT = {
  pageMaxWidth: "max-w-[1440px]",
  desktopSidePadding: "lg:px-[92px]",
  contentGap: "gap-6",
  sidebarGap: "lg:gap-9",
} as const;

export default function SearchPageContent() {
  const { currentPage, totalPages, handlePageChange } = usePetSitterSearch();
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
          className={`order-1 lg:order-2 flex flex-col  items-center lg:flex-row  lg:items-start justify-center ${LAYOUT.desktopSidePadding} ${LAYOUT.sidebarGap}`}
        >
          <FilterSideBar />
          <div className="block lg:hidden mt-10 mb-6">
            <HeaderSearchViewMode />
          </div>
          <div className="order-3 lg:order-2 w-full flex justify-center items-center">
            <MainViewSearch />
          </div>
        </div>
      </div>

      {/* ── Pagination ── */}
      {viewMode === "list" ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className="w-full flex justify-center pt-6 pb-[196px]"></div>
      )}
    </>
  );
}
