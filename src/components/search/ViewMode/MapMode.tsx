"use client";

import dynamic from "next/dynamic";
import { EmblaCarousel } from "../Carousel/EmblaCarousel";
import type { PetSitterDetail } from "@/hooks/search/map/useSelectMaker";
import type { MapControlsProps } from "@/components/map-search/MapControls";
import RecenterOnMarker from "@/components/Map/RecenterOnMarker";

interface MapModeProps {
  readonly selectedMarker: PetSitterDetail | null;
  readonly handleSelectPetSitter: (petSitter: PetSitterDetail) => void;
}

// ssr: false ทั้งคู่ — Leaflet ต้องการ window ซึ่งมีแค่ใน browser
// MapControls import UserMarker ซึ่ง import L from "leaflet" → ต้อง dynamic ด้วย
const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
});
const MapControls = dynamic<MapControlsProps>(
  () => import("@/components/map-search/MapControls"),
  { ssr: false },
);

export default function MapMode({
  selectedMarker,
  handleSelectPetSitter,
}: Readonly<MapModeProps>) {
  return (
    <section
      id="map-fullscreen-wrapper"
      className="relative max-w-[850px] min-w-[300px] max-h-[840px] h-screen w-full  sm:aspect-square"
    >
      {/* wrapper นี้ขอ fullscreen ทั้งก้อน — ครอบทั้ง map + slider */}
      <LeafletMap className="w-full h-full" center={selectedMarker?.position}>
        <MapControls
          selectedMarker={selectedMarker}
          handleSelectPetSitter={handleSelectPetSitter}
        />
      </LeafletMap>
      {/* slider อยู่ใน wrapper → ติดตามเข้า fullscreen ด้วย */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1000 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full pointer-events-auto pb-4">
          <EmblaCarousel
            selectedMarker={selectedMarker}
            handleSelectPetSitter={handleSelectPetSitter}
          />
        </div>
      </div>
    </section>
  );
}
