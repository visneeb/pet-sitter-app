"use client";

import SearchPageContent from "@/components/search/SearchPageContent";
import { PetSitterSearchProvider } from "@/contexts/PetSitterSearchContext";
import { Suspense } from "react";

export default function SearchPageClientShell() {
  return (
    <Suspense>
      <PetSitterSearchProvider>
        <SearchPageContent />
      </PetSitterSearchProvider>
    </Suspense>
  );
}
