"use client";

import { Route } from "lucide-react";

import MapIconButton from "./MapIconButton";

interface ButtonRouteProps {
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly active?: boolean;
  readonly onClick: () => void;
}

export default function ButtonRoute({
  disabled,
  loading,
  active = false,
  onClick,
}: Readonly<ButtonRouteProps>) {
  return (
    <div className="leaflet-control">
      <MapIconButton
        onClick={onClick}
        disabled={disabled}
        title={
          loading
            ? "Calculating route..."
            : "Show route between me and the sitter"
        }
        aria-pressed={active}
      >
        <Route
          size={20}
          color={active ? "#2563EB" : "#7B7E8F"}
          aria-hidden
        />
      </MapIconButton>
    </div>
  );
}

