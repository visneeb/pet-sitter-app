// ── PinMarker: หมุดแผนที่ลายอุ้งเท้า ─────────────────────────────────────────
// default → พื้นขาว / icon ส้ม
// selected → พื้นส้ม / icon ขาว

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { PinMarker } from "./PinMarker";

import ReactDOMServer from "react-dom/server";

// ─── Icon Factory ─────────────────────────────────────────────────────────────
function createPinIcon(selected: boolean): L.DivIcon {
  // render component เป็น HTML string เพื่อให้ Leaflet นำไปวาดได้
  const svgString = ReactDOMServer.renderToString(
    <PinMarker selected={selected} />,
  );

  return L.divIcon({
    className: "bg-transparent", // ล้างสไตล์เริ่มต้นของ Leaflet (กล่องก้อนขาวๆ)
    html: svgString,
    iconSize: [88, 88], // ✅ ขนาดเท่า viewBox ของ SVG: width="88" height="88"
    iconAnchor: [44, 88], 
    popupAnchor: [0, -88], // ให้อยู่เหนือตอนปลายหมุดขึ้นไป
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PinMarkerProps {
  readonly position: [number, number];
  readonly selected?: boolean; // false = default (ขาว/ส้ม), true = selected (ส้ม/ขาว)
  readonly popupContent?: React.ReactNode;
  readonly onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SitterMarker({
  position,
  selected = false,
  popupContent,
  onClick,
}: Readonly<PinMarkerProps>) {
  const icon = createPinIcon(selected);

  return (
    <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
      {popupContent && <Popup>{popupContent}</Popup>}
    </Marker>
  );
}
