"use client";

import { Suspense } from "react";
import Loading from "@/components/common/loading/loading";
import { PetSitterSearchProvider } from "@/contexts/PetSitterSearchContext";
import SearchPageContent from "@/components/search/SearchPageContent";

// ── Layout Constants ────────────────────────────────────────
const PAGE_STYLES = {
  minHeight: "min-h-[375px]",
  bgColor: "bg-[#FAFAFB]",
} as const;

export default function SearchPage() {
  return (
    <div
      className={`${PAGE_STYLES.minHeight} ${PAGE_STYLES.bgColor} text-gray-900 flex flex-col justify-between items-start`}
    >
      <Suspense fallback={<Loading />}>
        <PetSitterSearchProvider>
          <SearchPageContent />
        </PetSitterSearchProvider>
      </Suspense>
    </div>
  );
}
