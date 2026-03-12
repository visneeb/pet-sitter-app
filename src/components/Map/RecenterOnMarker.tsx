"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface RecenterOnMarkerProps {
  readonly position: LatLngExpression | null | undefined;
  readonly minZoom?: number;
  readonly paddingRatio?: number;
  readonly flyDuration?: number;
}

export default function RecenterOnMarker({
  position,
  minZoom = 10,
  paddingRatio = 0,
  flyDuration = 2.2,
}: Readonly<RecenterOnMarkerProps>) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    const currentBounds = map.getBounds();
    const paddedBounds = currentBounds.pad(paddingRatio);

    const latLng = position as LatLngExpression;

    if (paddedBounds.contains(latLng)) {
      return;
    }

    const currentZoom = map.getZoom();
    const targetZoom = Math.max(currentZoom, minZoom);

    map.flyTo(latLng, targetZoom, {
      animate: true,
      duration: flyDuration,
    });
  }, [map, position, minZoom, paddingRatio, flyDuration]);

  return null;
}

