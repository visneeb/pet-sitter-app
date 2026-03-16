import { useState } from "react";
import { useMapEvents } from "react-leaflet";

// Single Responsibility: track zoom level เท่านั้น
// ต้องเรียกข้างใน <MapContainer>
export default function useMapZoom() {
  const map = useMapEvents({
    zoom: (e) => setZoom(e.target.getZoom()),
  });
  const [zoom, setZoom] = useState<number>(map.getZoom());

  return { zoom };
}
