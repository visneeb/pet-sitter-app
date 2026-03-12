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

export function usePetSittersQuery(
  filters: FilterParams,
  page: number,
  limit: number,
  seed: string,
  options?: { enabled?: boolean },
): UsePetSittersQueryResult {
  const { enabled = true } = options ?? {};

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
          `${process.env.NEXT_PUBLIC_API_URL}/pet-sitter`,
          { params, signal: controller.signal },
        );

        const raw = response.data;
        const list = Array.isArray(raw?.sitters) ? raw.sitters : [];
        setState({
          petSitters: list,
          totalPages: raw.totalPages ?? 1,
          totalPetSitters: raw.totalPetSitters ?? 0,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (!axios.isCancel(err)) {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch pet sitter data", err);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Failed to fetch pet sitter data",
          }));
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [enabled, filters, page, limit, seed]);

  return state;
}
