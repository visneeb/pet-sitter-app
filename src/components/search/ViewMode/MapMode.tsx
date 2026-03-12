"use client";

import dynamic from "next/dynamic";
import { EmblaCarousel } from "../Carousel/EmblaCarousel";

// ssr: false ทั้งคู่ — Leaflet ต้องการ window ซึ่งมีแค่ใน browser
// MapControls import UserMarker ซึ่ง import L from "leaflet" → ต้อง dynamic ด้วย
const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/map-search/MapControls"),
  { ssr: false },
);

export default function MapMode() {
  return (
    <section id="map-fullscreen-wrapper" className="relative w-full h-full">
      {/* wrapper นี้ขอ fullscreen ทั้งก้อน — ครอบทั้ง map + slider */}

      <LeafletMap className="w-full h-full" >
        <MapControls />
      </LeafletMap>
      {/* slider อยู่ใน wrapper → ติดตามเข้า fullscreen ด้วย */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-900 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full pointer-events-auto pb-4">
          <EmblaCarousel />
        </div>
      </div>
    </section>
  );
}
