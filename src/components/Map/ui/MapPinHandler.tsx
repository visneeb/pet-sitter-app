// src/components/Map/ui/MapPinHandler.tsx
import useMapPin from "@/hooks/map/useMapPin";
import PinDropMarker from "./Marker/PinDropMarker"; // component ใหม่

export default function MapPinHandler() {
  const { pinPosition, clearPin } = useMapPin();

  return (
    <>
      {pinPosition && (
        <PinDropMarker position={pinPosition} onClose={clearPin} />
      )}
    </>
  );
}
