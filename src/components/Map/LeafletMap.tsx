"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapProps } from "@/types/map";
import cn from "@/utils/cn";

// ── Main Map Component ────────────────────────────────────────────────────────
export default function LeafletMap({
  children,
  center,
  zoom = 13,
  className,
}: Readonly<MapProps>) {
  const defaultPos: [number, number] = center ?? [13.7563, 100.5018];
  return (
    <MapContainer
      center={center ?? defaultPos}
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
