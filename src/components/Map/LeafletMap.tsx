"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapProps } from "@/types/map";
import cn from "@/utils/cn";
import { isValidLatLng } from "@/utils/map";

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018];

// ── Main Map Component ────────────────────────────────────────────────────────
export default function LeafletMap({
  children,
  center,
  zoom = 13,
  className,
}: Readonly<MapProps>) {
  const safeCenter = isValidLatLng(center) ? center : DEFAULT_CENTER;
  return (
    <MapContainer
      center={safeCenter}
      zoom={zoom}
      zoomControl={false}
      // style={{ height: "100vh", width: "100%", borderRadius: "16px" }}
      className={cn("w-screen h-screen rounded-2xl", className ?? "")}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
