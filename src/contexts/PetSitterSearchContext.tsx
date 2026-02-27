"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { PetSitter } from "@/types/PetSittersType";
import { FilterParams } from "@/types/FilterParams";

// ── URL param keys ──────────────────────────────────────────
const PARAM_KEYS = {
  search: "search",
  petTypes: "petTypes",
  rating: "rating",
  experience: "exp",
  page: "page",
  searchSeed: "seed",
} as const;

// ── Pagination defaults ─────────────────────────────────────
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

// ── Default values ──────────────────────────────────────────
const DEFAULT_EXPERIENCE = "";

// ── Helpers: read URL → filter state ────────────────────────
function parseFiltersFromURL(searchParams: URLSearchParams): FilterParams {
  const filters: FilterParams = {};

  const search = searchParams.get(PARAM_KEYS.search);
  if (search) filters.searchText = search;

  const petTypes = searchParams.get(PARAM_KEYS.petTypes);
  if (petTypes) filters.petTypes = petTypes.split(",");

  const rating = searchParams.get(PARAM_KEYS.rating);
  if (rating) filters.rating = rating.split(",").map(Number);

  const exp = searchParams.get(PARAM_KEYS.experience);
  if (exp) filters.experience = exp;

  return filters;
}

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

// ── Provider ────────────────────────────────────────────────
export function PetSitterSearchProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─ Read initial filters from URL on mount ─
  const initialFilters = useMemo(
    () =>
      parseFiltersFromURL(new URLSearchParams(searchParams?.toString() ?? "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Only run on mount
  );

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
  const [totalPages, setTotalPages] = useState(1);
  const [totalPetSitters, setTotalPetSitters] = useState(0);

  // ─ Seed state (for consistent randomization) ─
  const [searchSeed, setSearchSeed] = useState(() =>
    Math.random().toString(36).substring(2, 10),
  );

  // ─ Data fetching state ─
  const [petSitters, setPetSitters] = useState<PetSitter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch whenever appliedFilters or currentPage changes ──
  useEffect(() => {
    const controller = new AbortController();

    const fetchPetSitters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query params — match backend API expectations
        const params: Record<string, string> = {};

        // Pagination params
        params.page = String(currentPage);
        params.limit = String(DEFAULT_LIMIT);

        if (appliedFilters.searchText) {
          params.keyword = appliedFilters.searchText;
        }
        if (appliedFilters.petTypes && appliedFilters.petTypes.length > 0) {
          params.pet_type = appliedFilters.petTypes.join(",");
        }
        if (appliedFilters.rating && appliedFilters.rating.length > 0) {
          // Backend expects a single rating integer (1-5)
          params.rating = String(appliedFilters.rating[0]);
        }
        if (appliedFilters.experience) {
          // Convert "0-3 Years" → "0-3", "5+ Years" → "5-"
          params.experience = appliedFilters.experience
            .replace(" Years", "")
            .replace("+", "-");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/pet-sitter`,
          { params, signal: controller.signal },
        );
        const raw = response.data;

        // Backend returns { sitters: [...], totalPages, currentPage, ... }
        const list = Array.isArray(raw?.sitters) ? raw.sitters : [];

        setPetSitters(list);
        setTotalPages(raw.totalPages ?? 1);
        setTotalPetSitters(raw.totalPetSitters ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch pet sitter data", err);
          setError("Failed to fetch pet sitter data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetSitters();

    return () => {
      controller.abort();
    };
  }, [appliedFilters, currentPage, searchSeed]);

  // ── Helper: push filters to URL ───────────────────────────
  const pushFiltersToURL = useCallback(
    (filters: FilterParams) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      // Remove all filter keys first, then re-add non-empty ones
      Object.values(PARAM_KEYS).forEach((key) => params.delete(key));

      if (filters.searchText) {
        params.set(PARAM_KEYS.search, filters.searchText);
      }
      if (filters.petTypes && filters.petTypes.length > 0) {
        params.set(PARAM_KEYS.petTypes, filters.petTypes.join(","));
      }
      if (filters.rating && filters.rating.length > 0) {
        params.set(PARAM_KEYS.rating, filters.rating.join(","));
      }
      if (filters.experience) {
        params.set(PARAM_KEYS.experience, filters.experience);
      }
      if (searchSeed) {
        params.set(PARAM_KEYS.searchSeed, searchSeed);
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?");
    },
    [router, searchParams],
  );

  // ── Helper: push filters to navigator ───────────────────────────
  const pushFiltersToNavigator = useCallback(
    (filters: FilterParams) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      // Remove all filter keys first, then re-add non-empty ones
      Object.values(PARAM_KEYS).forEach((key) => params.delete(key));

      if (filters.searchText) {
        params.set(PARAM_KEYS.search, filters.searchText);
      }
      if (filters.petTypes && filters.petTypes.length > 0) {
        params.set(PARAM_KEYS.petTypes, filters.petTypes.join(","));
      }
      if (filters.rating && filters.rating.length > 0) {
        params.set(PARAM_KEYS.rating, filters.rating.join(","));
      }
      if (filters.experience) {
        params.set(PARAM_KEYS.experience, filters.experience);
      }
      if (searchSeed) {
        params.set(PARAM_KEYS.searchSeed, searchSeed);
      }

      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : "?"}`);
    },
    [router, searchParams],
  );

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
    const filters: FilterParams = { searchText, petTypes, rating, experience };
    setCurrentPage(DEFAULT_PAGE); // Reset to page 1 on new search
    setSearchSeed(Math.random().toString(36).substring(2, 10)); // Generate new seed
    pushFiltersToURL(filters);
    setAppliedFilters(filters);
  }, [searchText, petTypes, rating, experience, pushFiltersToURL]);

  const handleNavigateToSearch = useCallback(() => {
    const filters: FilterParams = { searchText, petTypes, rating, experience };
    setCurrentPage(DEFAULT_PAGE); // Reset to page 1 on new search
    setSearchSeed(Math.random().toString(36).substring(2, 10)); // Generate new seed
    pushFiltersToNavigator(filters);
    setAppliedFilters(filters);
  }, [searchText, petTypes, rating, experience, pushFiltersToNavigator]);

  const handleClear = useCallback(() => {
    setSearchText("");
    setPetTypes([]);
    setRating([]);
    setExperience(DEFAULT_EXPERIENCE);
    setCurrentPage(DEFAULT_PAGE); // Reset to page 1 on clear
    setSearchSeed(Math.random().toString(36).substring(2, 10)); // Generate new seed

    const emptyFilters: FilterParams = {};
    pushFiltersToURL(emptyFilters);
    setAppliedFilters(emptyFilters);
  }, [pushFiltersToURL]);

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
