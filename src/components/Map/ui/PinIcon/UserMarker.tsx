import L from "leaflet";
import { Circle, CircleMarker, Marker, Popup } from "react-leaflet";
import useMapZoom from "@/hooks/map/useMapZoom";
import { UserMarkerProps } from "@/types/map";

// ─── Constants ──────────────────────────────────────────────────────────────
// zoom >= threshold → แสดง area (Circle) แทน dot Marker
const AREA_ZOOM_THRESHOLD = 17;

// dot icon สร้างใน component เพื่อป้องกัน SSR crash (L.divIcon ต้องการ window)

// ─── Component ───────────────────────────────────────────────────────────────
export default function UserMarker({
  position,
  accuracy,
}: Readonly<UserMarkerProps>) {
  const { zoom } = useMapZoom();

  // สร้าง icon ใน browser เท่านั้น (ไม่ใช่ module-level)
  const userIcon = L.divIcon({
    className: "",
    html: `<div style="
      width: 16px; height: 16px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.4);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  // High zoom → แสดงวงกลม accuracy area + dot เล็กตรงกลาง
  if (zoom >= AREA_ZOOM_THRESHOLD) {
    return (
      <>
        {/* วงกลมแสดงรัศมีความแม่นยำของ GPS */}
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.12,
            weight: 1.5,
          }}
        />
        {/* dot เล็กตรงกลาง — บอกตำแหน่งที่แน่นอน */}
        <CircleMarker
          center={position}
          radius={6}
          pathOptions={{
            color: "white",
            fillColor: "#3b82f6",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>📍 ตำแหน่งของคุณ (accuracy: {Math.round(accuracy)} ม.)</Popup>
        </CircleMarker>
      </>
    );
  }

  // Low zoom → แสดง dot Marker เดิม
  return (
    <Marker position={position} icon={userIcon} zIndexOffset={1000}>
      <Popup>📍 ตำแหน่งของคุณ</Popup>
    </Marker>
  );
}
