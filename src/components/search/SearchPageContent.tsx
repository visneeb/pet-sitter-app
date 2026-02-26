"use client";

import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import FilterSidebar from "@/components/search/FilterSideBar";
import MainViewSearch from "@/components/search/MainViewSearch";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import { Pagination } from "@/components/ui/Pagination";

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

  return (
    <>
      {/* ── Content Container ── */}
      <div
        className={`w-full ${LAYOUT.pageMaxWidth} self-center flex flex-col ${LAYOUT.contentGap} px-4 lg:px-0`}
      >
        {/* Header — Mobile: อันดับ 2 / Desktop: อันดับ 1 */}
        <div className="order-2 lg:order-1">
          <HeaderSearchViewMode />
        </div>

        {/* Filter + Main wrapper
            Mobile: column (filter order-1, main order-3)
            Desktop: row side-by-side */}
        <div
          className={`order-1 lg:order-2 flex flex-col lg:flex-row items-center lg:items-start justify-center ${LAYOUT.desktopSidePadding} ${LAYOUT.sidebarGap}`}
        >
          <FilterSidebar />
          {/* MainViewSearch — อยู่ใต้ filter บน mobile, ข้างๆ filter บน desktop */}
          <div className="order-3 lg:order-2 w-full">
            <MainViewSearch />
          </div>
        </div>
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
