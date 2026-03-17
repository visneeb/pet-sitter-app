// ── ButtonZoom: ปุ่ม zoom in / zoom out แบบ custom ──────────────────────────
// ต้องอยู่ข้างใน <MapContainer> เท่านั้น เพราะใช้ useMap()

import { Plus, Minus } from "lucide-react";
import { useMap } from "react-leaflet";
import MapIconButton from "./MapIconButton";

export default function ButtonZoomIn() {
  const map = useMap();

  return (
    <div className="leaflet-control">
      <MapIconButton onClick={() => map.zoomIn()} title="Zoom in">
        <Plus size={18} color="#7B7E8F" />
      </MapIconButton>
    </div>
  );
}
