// src/hooks/map/useZipSearch.ts
import { useState, useRef, useCallback } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";

type Status = "idle" | "loading" | "success" | "error";

export interface ZipSearchResult {
  /** LatLngBounds tuple [[southLat, westLng], [northLat, eastLng]] */
  bounds: LatLngBoundsExpression | null;
  status: Status;
  errorMsg: string | null;
}

export default function useZipSearch() {
  const map = useMap();
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timestamp of the last request (ms epoch). Starts at 0 so first call is always allowed.
  const lastRequestRef = useRef<number>(0);
  // ป้องกัน flyToBounds() trigger zoomstart แล้วล้างกรอบก่อนแสดง
  const isProgrammaticRef = useRef<boolean>(false);

  // ── Clear rectangle เฉพาะเมื่อ user เป็นคนขยับแผนที่เอง ─────────────────
  useMapEvents({
    dragstart: () => {
      if (!isProgrammaticRef.current) setBounds(null);
    },
    zoomstart: () => {
      if (!isProgrammaticRef.current) setBounds(null);
    },
    moveend: () => {
      // reset flag หลัง animation เสร็จ
      isProgrammaticRef.current = false;
    },
  });

  // ── Search handler ───────────────────────────────────────────────────────
  const searchByZip = useCallback(
    async (postalCode: string) => {
      const trimmed = postalCode.trim();
      if (!trimmed) return;

      // ── Rate-limit: ห้ามส่ง request เร็วกว่า 1 วินาที ───────────────────
      const now = Date.now();
      const elapsed = now - lastRequestRef.current;
      if (elapsed < 1000) {
        const wait = 1000 - elapsed;
        await new Promise((res) => setTimeout(res, wait));
      }
      lastRequestRef.current = Date.now();

      setStatus("loading");
      setErrorMsg(null);
      setBounds(null);

      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("postalcode", trimmed);
        url.searchParams.set("countrycodes", "th");
        url.searchParams.set("format", "json");
        // Request bounding-box data from Nominatim
        url.searchParams.set("limit", "1");

        const res = await fetch(url.toString(), {
          headers: {
            // Nominatim usage policy requires a descriptive User-Agent
            "Accept-Language": "th,en",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Array<{
          lat: string;
          lon: string;
          boundingbox: [string, string, string, string]; // [minLat, maxLat, minLng, maxLng]
          display_name: string;
        }> = await res.json();

        if (data.length === 0) {
          setStatus("error");
          setErrorMsg("Not found this postal code");
          return;
        }

        const [minLat, maxLat, minLng, maxLng] = data[0].boundingbox;
        const leafletBounds: LatLngBoundsExpression = [
          [Number.parseFloat(minLat), Number.parseFloat(minLng)],
          [Number.parseFloat(maxLat), Number.parseFloat(maxLng)],
        ];

        setBounds(leafletBounds);
        setStatus("success");

        // ตั้ง flag ก่อน flyToBounds เพื่อป้องกัน zoomstart ล้างกรอบ
        isProgrammaticRef.current = true;
        map.flyToBounds(leafletBounds, { padding: [40, 40], duration: 0.8 });
      } catch (err) {
        setStatus("error");
        setErrorMsg("An error occurred. Please try again.");
        console.error("[useZipSearch]", err);
      }
    },
    [map],
  );

  const clearBounds = useCallback(() => {
    setBounds(null);
    setStatus("idle");
    setErrorMsg(null);
  }, []);

  return { bounds, status, errorMsg, searchByZip, clearBounds };
}
