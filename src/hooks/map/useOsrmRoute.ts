import { useCallback, useState } from "react";

export type LatLngTuple = [number, number];

export interface UseOsrmRouteResult {
  readonly loading: boolean;
  readonly error: string | null;
  readonly routeCoords: LatLngTuple[];
  readonly routeDistanceKm: number | null;
  readonly fetchRoute: (from: LatLngTuple, to: LatLngTuple) => Promise<void>;
}

const OSRM_BASE_URL = "https://router.project-osrm.org";

function buildOsrmUrl(from: LatLngTuple, to: LatLngTuple): string {
  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;

  // OSRM expects {lng},{lat} order
  const fromCoord = `${fromLng},${fromLat}`;
  const toCoord = `${toLng},${toLat}`;

  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
  });

  return `${OSRM_BASE_URL}/route/v1/driving/${fromCoord};${toCoord}?${params.toString()}`;
}

export default function useOsrmRoute(): UseOsrmRouteResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLngTuple[]>([]);
  const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);

  const fetchRoute = useCallback(async (from: LatLngTuple, to: LatLngTuple) => {
    try {
      setLoading(true);
      setError(null);
      // ล้างเส้นทางและระยะทางเดิมก่อน เพื่อไม่ให้แสดงเส้นเก่าระหว่างรอผลใหม่
      // setRouteCoords([]);
      setRouteDistanceKm(null);

      const url = buildOsrmUrl(from, to);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`OSRM error: ${res.status}`);
      }

      const data = await res.json();
      const route = data?.routes?.[0];

      if (!route || !route.geometry || !route.geometry.coordinates) {
        throw new Error("No route found");
      }

      const coords: LatLngTuple[] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      );

      setRouteCoords(coords);
      setRouteDistanceKm(typeof route.distance === "number" ? route.distance / 1000 : null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown routing error";
      setError(message);
      setRouteCoords([]);
      setRouteDistanceKm(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    routeCoords,
    routeDistanceKm,
    fetchRoute,
  };
}

