"use client";

import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { SitterProfileFormValues } from "@/lib/validations/sitterProfileValidation";
import { Province, District, SubDistrict } from "@/services/api/address";

const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/pet-sitter/map/SitterMapControl"),
  { ssr: false },
);

interface SitterProfileMapProps {
  sitterMethods?: UseFormReturn<SitterProfileFormValues>;
  provinces?: Province[];
  districts?: District[];
  subDistricts?: SubDistrict[];
  setExternalUpdate?: (isExternal: boolean) => void;
  setDistricts?: (districts: District[]) => void;
  setSubDistricts?: (subDistricts: SubDistrict[]) => void;
}

export default function SitterProfileMap({
  sitterMethods,
  provinces,
  districts,
  subDistricts,
  setExternalUpdate,
  setDistricts,
  setSubDistricts,
}: SitterProfileMapProps) {
  return (
    <section id="map-fullscreen-wrapper" className="z-0 relative w-full h-96">
      <LeafletMap
        key="sitter-profile-map"
        className="w-full h-full"
        center={[13.744, 100.532]}
        zoom={13}
      >
        <MapControls
          sitterMethods={sitterMethods}
          provinces={provinces}
          districts={districts}
          subDistricts={subDistricts}
          setExternalUpdate={setExternalUpdate}
          setDistricts={setDistricts}
          setSubDistricts={setSubDistricts}
        />
      </LeafletMap>
    </section>
  );
}
