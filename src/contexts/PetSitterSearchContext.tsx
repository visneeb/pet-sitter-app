"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PetSitter } from "@/types/PetSittersType";
import { FilterParams } from "@/types/FilterParams";
import { useSearchFilterUrl } from "@/features/search/hooks/useSearchFilterUrl";
import { usePetSittersQuery } from "@/features/search/hooks/usePetSittersQuery";

// ── URL param keys ──────────────────────────────────────────
const PARAM_KEYS = {
  search: "search",
  petTypes: "petTypes",
  rating: "rating",
  experience: "exp",
  page: "page",
  seed: "seed",
} as const;

// ── Pagination defaults ─────────────────────────────────────
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

// ── Default values ──────────────────────────────────────────
const DEFAULT_EXPERIENCE = "";

const randomSeed = () => Math.random().toString(36).substring(2, 10);

// ── Context type ────────────────────────────────────────────
interface PetSitterSearchContextType {
  // Filter UI state (local, not yet submitted)
  searchText: string;
  petTypes: string[];
  rating: number[];
  experience: string;

  // Filter handlers
  handleSearchChange: (value: string) => void;
  handlePetTypesChange: (value: string[]) => void;
  handleRatingChange: (value: number[]) => void;
  handleExperienceChange: (value: string) => void;

  // Actions
  handleNavigateToSearch: () => void;
  handleSearch: () => void;
  handleClear: () => void;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalPetSitters: number;
  handlePageChange: (page: number) => void;

  // Data
  petSitters: PetSitter[];
  isLoading: boolean;
  error: string | null;
}

const PetSitterSearchContext = createContext<PetSitterSearchContextType | null>(
  null,
);

interface PetSitterSearchProviderProps {
  children: ReactNode;
  enableQuery?: boolean;
}

// ── Provider ────────────────────────────────────────────────
export function PetSitterSearchProvider({
  children,
  enableQuery = true,
}: Readonly<PetSitterSearchProviderProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    initialFilters,
    pushFiltersToCurrentUrl,
    pushFiltersToSearchPage,
  } = useSearchFilterUrl();

  // ─ Filter UI state (what the user is currently editing) ─
  const [searchText, setSearchText] = useState(initialFilters.searchText ?? "");
  const [petTypes, setPetTypes] = useState<string[]>(
    initialFilters.petTypes ?? [],
  );
  const [rating, setRating] = useState<number[]>(initialFilters.rating ?? []);
  const [experience, setExperience] = useState(
    initialFilters.experience ?? DEFAULT_EXPERIENCE,
  );

  
  // ─ Applied filters (driven by URL params) ─
  const [appliedFilters, setAppliedFilters] =
    useState<FilterParams>(initialFilters);

  // ─ Pagination state ─
  const initialPage = (() => {
    const p = new URLSearchParams(searchParams?.toString() ?? "").get(
      PARAM_KEYS.page,
    );
    return p ? Math.max(1, Number(p)) : DEFAULT_PAGE;
  })();
  const [currentPage, setCurrentPage] = useState(initialPage);

  // ─ Seed state (for consistent randomization) ─
  const [seed, setSeed] = useState(() =>
    initialFilters.seed ?? randomSeed(),
  );

  const {
    petSitters,
    totalPages,
    totalPetSitters,
    isLoading,
    error,
  } = usePetSittersQuery(appliedFilters, currentPage, DEFAULT_LIMIT, seed, {
    enabled: enableQuery,
  });

  // ── Filter handlers ───────────────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handlePetTypesChange = useCallback((value: string[]) => {
    setPetTypes(value);
  }, []);

  const handleRatingChange = useCallback((value: number[]) => {
    setRating(value);
  }, []);

  const handleExperienceChange = useCallback((value: string) => {
    setExperience(value);
  }, []);

  // ── Actions ───────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    const newSeed = randomSeed();
    const filters: FilterParams = {
      searchText,
      petTypes,
      rating,
      experience,
      seed: newSeed,
    };
    setCurrentPage(DEFAULT_PAGE);
    setSeed(newSeed);
    pushFiltersToCurrentUrl(filters);
    setAppliedFilters(filters);
  }, [
    searchText,
    petTypes,
    rating,
    experience,
    pushFiltersToCurrentUrl,
  ]);

  const handleNavigateToSearch = useCallback(() => {
    const newSeed = randomSeed();
    const filters: FilterParams = {
      searchText,
      petTypes,
      rating,
      experience,
      seed: newSeed,
    };
    setCurrentPage(DEFAULT_PAGE);
    setSeed(newSeed);
    pushFiltersToSearchPage(filters);
    setAppliedFilters(filters);
  }, [
    searchText,
    petTypes,
    rating,
    experience,
    pushFiltersToSearchPage,
  ]);

  const handleClear = useCallback(() => {
    setSearchText("");
    setPetTypes([]);
    setRating([]);
    setExperience(DEFAULT_EXPERIENCE);
    setCurrentPage(DEFAULT_PAGE);
    const newSeed = randomSeed();
    setSeed(newSeed);

    const emptyFilters: FilterParams = { seed: newSeed };
    pushFiltersToCurrentUrl(emptyFilters);
    setAppliedFilters(emptyFilters);
  }, [pushFiltersToCurrentUrl]);

  // ── Pagination handler ────────────────────────────────────
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      // Update URL with page param
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (page <= 1) {
        params.delete(PARAM_KEYS.page);
      } else {
        params.set(PARAM_KEYS.page, String(page));
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?");
    },
    [router, searchParams],
  );

  // ── Memoize context value ─────────────────────────────────
  const value = useMemo<PetSitterSearchContextType>(
    () => ({
      searchText,
      petTypes,
      rating,
      experience,
      handleSearchChange,
      handlePetTypesChange,
      handleRatingChange,
      handleExperienceChange,
      handleNavigateToSearch,
      handleSearch,
      handleClear,
      currentPage,
      totalPages,
      totalPetSitters,
      handlePageChange,
      petSitters,
      isLoading,
      error,
    }),
    [
      searchText,
      petTypes,
      rating,
      experience,
      handleSearchChange,
      handlePetTypesChange,
      handleRatingChange,
      handleExperienceChange,
      handleNavigateToSearch,
      handleSearch,
      handleClear,
      currentPage,
      totalPages,
      totalPetSitters,
      handlePageChange,
      petSitters,
      isLoading,
      error,
    ],
  );

  return (
    <PetSitterSearchContext.Provider value={value}>
      {children}
    </PetSitterSearchContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────
export function usePetSitterSearch() {
  const context = useContext(PetSitterSearchContext);
  if (!context) {
    throw new Error(
      "usePetSitterSearch must be used within a PetSitterSearchProvider",
    );
  }
  return context;
}
