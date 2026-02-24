"use client";

import Link from "next/link";
import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import ContentSearch from "@/components/search/ContentSearch";
import { PaginationBar } from "@/components/search/ui/PaginationBar";
import { Suspense, useEffect } from "react";
import Loading from "@/components/common/loading/loading";
import { useScreenContext } from "@/contexts/ScreenContext";
import FilterSidebar from "@/components/search/FilterSideBar";
import MainViewSearch from "@/components/search/MainViewSearch";
import TestResponsive from "@/components/search/testResponsive";
import cn from "@/utils/cn";

export default function SearchPage() {
  const { isSmall } = useScreenContext();
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between items-start">
      <Suspense fallback={<Loading />}>
        {/* <TestResponsive /> */}
        <div className="w-full max-w-[1440px] self-center flex flex-col gap-6">
          {/* Desktop Layout */}
          <div
            className={cn("hidden", isSmall && "flex flex-col gap-6 w-full")}
          >
            <HeaderSearchViewMode />
            <div className="w-full flex justify-center px-[92px] gap-9">
              <FilterSidebar />
              <MainViewSearch />
            </div>
          </div>

          {/* Mobile Layout */}
          <div
            className={cn(
              "flex flex-col gap-6 w-full px-4",
              isSmall && "hidden",
            )}
          >
            <FilterSidebar />
            <HeaderSearchViewMode />
            <MainViewSearch />
          </div>
        </div>
        <PaginationBar />
      </Suspense>
      {/* Mock up footer in Component */}
    </div>
  );
}
