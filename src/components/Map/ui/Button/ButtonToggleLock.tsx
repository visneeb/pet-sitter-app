"use client";

import { Lock, MapPin } from "lucide-react";

import MapIconButton from "./MapIconButton";

interface ButtonToggleLockProps {
  readonly active: boolean;
  readonly onToggle: () => void;
}

export default function ButtonToggleLock({
  active,
  onToggle,
}: Readonly<ButtonToggleLockProps>) {
  return (
    <div className="leaflet-control">
      <MapIconButton
        onClick={onToggle}
        title={active ? "Show me and the sitter" : "Focus on the sitter"}
        aria-pressed={active}
      >
        {active ? (
          <Lock size={20} color="#7B7E8F" aria-hidden />
        ) : (
          <MapPin size={20} color="#7B7E8F" aria-hidden />
        )}
      </MapIconButton>
    </div>
  );
}
