// src/hooks/map/useReverseGeo.ts
import { useState, useEffect, useRef } from "react";

interface ReverseGeoResult {
  address: string | null;
  addressDetails: Record<string, string> | null;
  loading: boolean;
  error: string | null;
}

interface UseReverseGeoParams {
  lat?: number;
  lon?: number;
  debounceMs?: number;
}

export default function useReverseGeo({
  lat,
  lon,
  debounceMs = 1000,
}: UseReverseGeoParams): ReverseGeoResult {
  const [address, setAddress] = useState<string | null>(null);
  const [addressDetails, setAddressDetails] = useState<Record<
    string,
    string
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    // Debounce — wait before hitting Nominatim
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      // Cancel any in-flight request
      abortController.current?.abort();
      abortController.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        // KEY FIX: addressdetails=1 returns data.address object
        // Without this param Nominatim only returns display_name (the formatted
        // string) and omits the structured address breakdown entirely.
        const url =
          `https://nominatim.openstreetmap.org/reverse` +
          `?format=json` +
          `&lat=${lat}` +
          `&lon=${lon}` +
          `&addressdetails=1` +
          `&accept-language=en,th`;

        const res = await fetch(url, {
          headers: { "User-Agent": "PetSitterApp/1.0" },
          signal: abortController.current.signal,
        });

        if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

        const data = await res.json();

        // data.display_name  → formatted address string
        // data.address       → structured breakdown (requires addressdetails=1)
        setAddress(data.display_name ?? null);
        setAddressDetails(data.address ?? null);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Reverse geocode failed:", err);
        setError(err.message ?? "Reverse geocode failed");
        setAddress(null);
        setAddressDetails(null);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [lat, lon, debounceMs]);

  return { address, addressDetails, loading, error };
}
