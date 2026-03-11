import { useState } from "react";
import { useMapEvents } from "react-leaflet";

export default function useMapPin() {
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      // Ignore clicks that originate from buttons or other UI elements on the map
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest("button, a, input, [role='button']")) {
        return;
      }

      const { lat, lng } = e.latlng;
      setPinPosition([lat, lng]);
    },
  });

  const setPin = (position: [number, number] | null) => {
    setPinPosition(position);
  };

  const clearPin = () => {
    setPinPosition(null);
  };

  return { pinPosition, setPin, clearPin };
}
