import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReverseGeoProps {
  lat: number | undefined;
  lon: number | undefined;
}

/** Structured address breakdown returned by Nominatim */
interface NominatimAddress {
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

interface ReverseGeoResult {
  address: string;
  addressDetails: NominatimAddress | null;
  loading: boolean;
  error: string | null;
}

/** Partial shape of the Nominatim API response we care about */
interface NominatimResponse {
  display_name: string;
  address: NominatimAddress;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Rate limit: Nominatim usage policy requires max 1 request/second.
 * We debounce the hook so it waits this long after the last coordinate
 * change before firing a real HTTP request.
 */
const DEBOUNCE_DELAY_MS = 1000;

/**
 * Precision (decimal places) used when building cache keys.
 * 5 decimal places ≈ 1 metre accuracy — good enough to share cache hits
 * across nearly-identical coordinates while not losing meaningful location detail.
 */
const CACHE_PRECISION = 5;

// ─── Module-level cache (survives re-renders, cleared on page reload) ─────────

const geoCache = new Map<string, string>();

function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(CACHE_PRECISION)},${lon.toFixed(CACHE_PRECISION)}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useReverseGeo
 *
 * Converts a lat/lon pair into a human-readable address using the
 * free Nominatim API. Includes:
 *   - Guard: skips fetch when coordinates are not yet defined
 *   - Debounce: waits DEBOUNCE_DELAY_MS after the last change before fetching
 *     (respects Nominatim's 1 req/s rate limit)
 *   - Abort Controller: cancels in-flight requests when coordinates change
 *     or the component unmounts (prevents stale-state race conditions)
 *   - In-memory cache: avoids re-fetching coordinates already resolved
 */
export default function useReverseGeo({
  lat,
  lon,
}: ReverseGeoProps): ReverseGeoResult {
  const [address, setAddress] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<NominatimAddress | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Guard: skip when coordinates are not yet available
    if (lat === undefined || lon === undefined) return;

    // Cache hit: return immediately without a network round-trip
    const cacheKey = getCacheKey(lat, lon);
    const cached = geoCache.get(cacheKey);
    if (cached !== undefined) {
      setAddress(cached);
      setError(null);
      return;
    }

    // Clear any pending debounce timer from a previous render
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce: only fire after the user stops moving the pin for 1 second
    debounceTimerRef.current = setTimeout(async () => {
      // Cancel any previous in-flight request to avoid race conditions
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const url = `${NOMINATIM_BASE_URL}?lat=${lat}&lon=${lon}&format=json`;
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            // Nominatim requires a descriptive User-Agent per their usage policy
            "User-Agent": "PetSitterApp/1.0",
            "Accept-Language": "th,en",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Geocoding failed: ${response.status} ${response.statusText}`,
          );
        }

        const data: NominatimResponse = await response.json();
        const resolvedAddress = data.display_name;
        const resolvedAddressDetails = data.address;

        // Store result in cache for future lookups
        geoCache.set(cacheKey, resolvedAddress);
        setAddress(resolvedAddress);
        setAddressDetails(resolvedAddressDetails);
      } catch (err) {
        // AbortError is expected when the request is intentionally cancelled
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);

    // Cleanup: cancel debounce timer and any in-flight request
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, [lat, lon]);

  return { address, addressDetails, loading, error };
}
