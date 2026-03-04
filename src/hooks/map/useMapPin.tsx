import { useState } from "react";
import { useMapEvents } from "react-leaflet";

export default function useMapPin() {
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      // ป้องกันการปักหมุดเมื่อ click มาจากปุ่มหรือ UI element อื่นๆ บนแผนที่
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest("button, a, input, [role='button']")) return;

      const { lat, lng } = e.latlng;
      setPinPosition([lat, lng]);
    },
  });

  const clearPin = () => setPinPosition(null);

  return { pinPosition, clearPin };
}
