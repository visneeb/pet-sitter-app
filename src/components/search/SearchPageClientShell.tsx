"use client";
import SearchPageLoading from "@/components/search/loading";
import SearchPageContent from "@/components/search/SearchPageContent";
import { PetSitterSearchProvider } from "@/contexts/PetSitterSearchContext";
import { Suspense } from "react";

export default function SearchPageClientShell() {
  return (
    <Suspense >
      <PetSitterSearchProvider>
        <SearchPageContent />
      </PetSitterSearchProvider>
    </Suspense>
  );
}
