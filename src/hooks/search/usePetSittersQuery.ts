import { useEffect, useState } from "react";
import axios from "axios";
import { FilterParams } from "@/types/FilterParams";
import { PetSitter } from "@/types/PetSittersType";
import { buildApiQueryParams } from "@/utils/search/searchFilters";

interface UsePetSittersQueryResult {
  petSitters: PetSitter[];
  totalPages: number;
  totalPetSitters: number;
  isLoading: boolean;
  error: string | null;
}

interface LocationSearchMeta {
  radiusUsed?: number;
  hasMore?: boolean;
}

export function usePetSittersQuery(
  filters: FilterParams,
  page: number,
  limit: number,
  seed: string,
  options?: {
    enabled?: boolean;
    onLocationMeta?: (meta: LocationSearchMeta | null) => void;
  },
): UsePetSittersQueryResult {
  const { enabled = true, onLocationMeta } = options ?? {};

  const [state, setState] = useState<UsePetSittersQueryResult>({
    petSitters: [],
    totalPages: 1,
    totalPetSitters: 0,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const params = buildApiQueryParams(filters, page, limit, seed);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pet-sitter`,
          { params, signal: controller.signal },
        );

        const raw = response.data;
        const list = Array.isArray(raw?.sitters) ? raw.sitters : [];
        const meta = raw?.meta ?? null;
        const radiusUsed =
          typeof meta?.radiusUsed === "number"
            ? meta.radiusUsed
            : typeof meta?.radius_used === "number"
              ? meta.radius_used
              : undefined;
        const hasMore =
          typeof meta?.hasMore === "boolean"
            ? meta.hasMore
            : typeof meta?.has_more === "boolean"
              ? meta.has_more
              : undefined;
        onLocationMeta?.(meta ? { radiusUsed, hasMore } : null);
        setState({
          petSitters: list,
          totalPages: raw.totalPages ?? 1,
          totalPetSitters: raw.totalPetSitters ?? 0,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch pet sitter data", err);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Failed to fetch pet sitter data",
          }));
          onLocationMeta?.(null);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [enabled, filters, page, limit, seed, onLocationMeta]);

  return state;
}
