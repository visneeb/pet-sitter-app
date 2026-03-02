import { FilterParams } from "@/types/FilterParams";

const PARAM_KEYS = {
  search: "search",
  petTypes: "petTypes",
  rating: "rating",
  experience: "exp",
  page: "page",
  seed: "seed",
} as const;

export function parseFiltersFromURLParams(
  params: URLSearchParams,
): FilterParams {
  const filters: FilterParams = {};

  const search = params.get(PARAM_KEYS.search);
  if (search) {
    filters.searchText = search;
  }

  const petTypes = params.get(PARAM_KEYS.petTypes);
  if (petTypes) {
    filters.petTypes = petTypes.split(",");
  }

  const rating = params.get(PARAM_KEYS.rating);
  if (rating) {
    filters.rating = rating.split(",").map(Number);
  }

  const exp = params.get(PARAM_KEYS.experience);
  if (exp) {
    filters.experience = exp;
  }

  const seed = params.get(PARAM_KEYS.seed);
  if (seed) {
    filters.seed = seed;
  }

  return filters;
}

export function buildURLSearchParamsFromFilters(
  base: URLSearchParams,
  filters: FilterParams,
): URLSearchParams {
  const params = new URLSearchParams(base.toString());

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

  if (filters.seed) {
    params.set(PARAM_KEYS.seed, filters.seed);
  }

  return params;
}

export function buildApiQueryParams(
  filters: FilterParams,
  page: number,
  limit: number,
  seed: string,
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
    seed,
  };

  if (filters.searchText) {
    params.keyword = filters.searchText;
  }

  if (filters.petTypes && filters.petTypes.length > 0) {
    params.pet_type = filters.petTypes.join(",");
  }

  if (filters.rating && filters.rating.length > 0) {
    params.rating = String(filters.rating[0]);
  }

  if (filters.experience) {
    params.experience = filters.experience
      .replace(" Years", "")
      .replace("+", "-");
  }

  return params;
}

