"use client";

import MapControls from "@/components/map-search/MapControls";
import dynamic from "next/dynamic";

// ssr: false → ไม่ให้ Next.js import Leaflet ตอน Server-Side Render
// เพราะ Leaflet ต้องการ window object ซึ่งมีแค่ใน browser เท่านั้น
const Map = dynamic(() => import("@/components/Map/Map"), { ssr: false });

export default function MapMode() {
  return (
    <Map>
      <MapControls />
    </Map>
  );
}
