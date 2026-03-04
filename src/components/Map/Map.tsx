"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode } from "react";

interface MapProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
}

// ── Main Map Component ────────────────────────────────────────────────────────
export default function Map({
  children,
  center,
  zoom = 13,
}: Readonly<MapProps>) {
  const defaultPos: [number, number] = center ?? [13.7563, 100.5018];

  return (
    <MapContainer
      center={defaultPos}
      zoom={zoom}
      zoomControl={false}
      style={{ height: "100vh", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {children}
    </MapContainer>
  );
}
