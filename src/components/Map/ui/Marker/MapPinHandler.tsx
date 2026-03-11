// src/components/Map/ui/Marker/MapPinHandler.tsx
import useMapPin from "@/hooks/map/useMapPin";
import PinDropMarker from "../PinIcon/PinDropMarker";
import { useEffect } from "react";
import useReverseGeo from "@/hooks/map/useReverseGeo";
import { useMap } from "react-leaflet";

interface MapPinHandlerProps {
  /** Called whenever the pin moves */
  onAddressSelect?: (
    address: string,
    addressDetails: any,
    coordinates: [number, number],
  ) => void;
  externalPinPosition?: [number, number] | null;
  shouldClearPin?: boolean;
}

export default function MapPinHandler({
  onAddressSelect,
  externalPinPosition,
  shouldClearPin,
}: MapPinHandlerProps) {
  const map = useMap();
  const { pinPosition, setPin, clearPin } = useMapPin();

  // ── Form → Map ────────────────────────────────────────────────────────────
  // When the parent supplies new coordinates (driven by form dropdowns or
  // manual lat/lng input) we move the pin imperatively, WITHOUT calling
  // onAddressSelect, so there is no reverse round-trip back to the form.
  useEffect(() => {
    if (!externalPinPosition) return;

    setPin(externalPinPosition);

    // Fly the map view to the new position
    map.flyTo(externalPinPosition, 15, { animate: true, duration: 0.8 });
  }, [externalPinPosition]);

  // Clear the user-click pin when the form-derived pin takes over
  useEffect(() => {
    if (shouldClearPin) clearPin();
  }, [shouldClearPin]);

  // Reverse-geocode the pin position set by a map click, then bubble the
  // resolved address up to the parent so it can populate the form.
  const { address, addressDetails, loading } = useReverseGeo({
    lat: pinPosition?.[0],
    lon: pinPosition?.[1],
  });

  useEffect(() => {
    // Only fire when the pin was placed by a real map click (not external)
    if (!pinPosition || !address || loading) return;

    // Guard: don't call back if this pin was set externally
    if (
      externalPinPosition &&
      externalPinPosition[0] === pinPosition[0] &&
      externalPinPosition[1] === pinPosition[1]
    ) {
      return;
    }

    onAddressSelect?.(address, addressDetails, pinPosition);
  }, [address, addressDetails, loading]);

  return (
    <>
      {pinPosition && (
        <PinDropMarker position={pinPosition} onClose={clearPin} />
      )}
    </>
  );
}
