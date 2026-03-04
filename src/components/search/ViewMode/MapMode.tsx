"use client";

import dynamic from "next/dynamic";

// ssr: false ทั้งคู่ — Leaflet ต้องการ window ซึ่งมีแค่ใน browser
// MapControls import UserMarker ซึ่ง import L from "leaflet" → ต้อง dynamic ด้วย
const LeafletMap = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/map-search/MapControls"),
  { ssr: false },
);

export default function MapMode() {
  return (
    <LeafletMap>
      <MapControls />
    </LeafletMap>
  );
}
