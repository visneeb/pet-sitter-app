// ── SitterMarker: หมุดแผนที่พี่เลี้ยงสัตว์เลี้ยง ─────────────────────────
// default (selected=false) → พื้นขาว / icon ส้ม
// selected (selected=true)  → พื้นส้ม / icon ขาว

import { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { PinMarker } from "../PinIcon/PinMarker";
import ReactDOMServer from "react-dom/server";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SitterMarkerProps {
  /** ตำแหน่งบนแผนที่ [lat, lng] */
  readonly position: [number, number];
  /** true = ถูกเลือก (พื้นส้ม/icon ขาว), false = ปกติ (พื้นขาว/icon ส้ม) */
  readonly selected?: boolean;
  /** เนื้อหาที่แสดงใน Popup เมื่อคลิก (optional) */
  readonly popupContent?: React.ReactNode;
  /** Callback เมื่อผู้ใช้คลิก marker */
  readonly onClick?: () => void;
}

// ─── Icon Factory ─────────────────────────────────────────────────────────────
/**
 * แปลง PinMarker (React component) → L.DivIcon สำหรับ Leaflet
 * แยกออกมาเพื่อให้ test / reuse ได้ง่าย และแคช icon ผ่าน useMemo
 */
function createPinIcon(selected: boolean): L.DivIcon {
  const svgString = ReactDOMServer.renderToString(
    <PinMarker selected={selected} />,
  );

  return L.divIcon({
    className: "bg-transparent", // ล้าง default style ของ Leaflet (กล่องขาวๆ)
    html: svgString,
    iconSize: [88, 88], // ตรงกับ viewBox width/height ของ SVG
    iconAnchor: [44, 88], // ปลายหมุดชี้ที่ตำแหน่งบนแผนที่
    popupAnchor: [0, -88], // Popup ลอยขึ้นเหนือหมุด
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OwnerMarker({
  position,
  selected = true,
  popupContent,
  onClick,
}: Readonly<SitterMarkerProps>) {
  // useMemo: สร้าง icon ใหม่เมื่อ selected เปลี่ยนเท่านั้น
  // ป้องกัน Leaflet re-render ที่ไม่จำเป็นทุกครั้งที่ parent re-render
  const icon = useMemo(() => createPinIcon(selected), [selected]);

  return (
    <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
      {popupContent && <Popup>{popupContent}</Popup>}
    </Marker>
  );
}
