// src/components/Map/ui/MapPinHandler.tsx
import useMapPin from "@/hooks/map/useMapPin";
import PinDropMarker from "../PinIcon/PinDropMarker"; // component ใหม่
import { useEffect } from "react";
import useReverseGeo from "@/hooks/map/useReverseGeo";

export default function MapPinHandler() {
  const { pinPosition, clearPin } = useMapPin();
  const { address, addressDetails, loading, error } = useReverseGeo({
    lat: pinPosition?.[0],
    lon: pinPosition?.[1],
  });
  
  return (
    <>
      {pinPosition && (
        <PinDropMarker position={pinPosition} onClose={clearPin} />
      )}
    </>
  );
}
