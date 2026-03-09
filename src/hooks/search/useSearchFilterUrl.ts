import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterParams } from "@/types/FilterParams";
import {
  parseFiltersFromURLParams,
  buildURLSearchParamsFromFilters,
} from "@/utils/search/searchFilters";

export function useSearchFilterUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters = useMemo(
    () =>
      parseFiltersFromURLParams(
        new URLSearchParams(searchParams?.toString() ?? ""),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pushFiltersToCurrentUrl = useCallback(
    (filters: FilterParams) => {
      const base = new URLSearchParams(searchParams?.toString() ?? "");
      const params = buildURLSearchParamsFromFilters(base, filters);
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?",{ scroll: false });
    },
    [router, searchParams],
  );

  const pushFiltersToSearchPage = useCallback(
    (filters: FilterParams) => {
      const base = new URLSearchParams(searchParams?.toString() ?? "");
      const params = buildURLSearchParamsFromFilters(base, filters);
      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : "?"}`);
    },
    [router, searchParams],
  );

  return {
    initialFilters,
    pushFiltersToCurrentUrl,
    pushFiltersToSearchPage,
  };
}
