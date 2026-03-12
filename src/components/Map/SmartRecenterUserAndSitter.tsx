"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import { isValidLatLng } from "@/utils/map";

interface SmartRecenterUserAndSitterProps {
  /**
   * When true: "follow me + shop together" — fitBounds(user, sitter).
   * When false: "shop-focused" — flyTo(sitter) only when sitter is selected.
   */
  readonly enabled?: boolean;
  readonly userPosition?: LatLngExpression | null;
  readonly sitterPosition?: LatLngExpression | null;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly paddingPx?: number;
  readonly flyDuration?: number;
  /**
   * Optional flag for future use.
   * When true, a higher-level map container can use it
   * to decide whether to skip auto-recentering after
   * the user has interacted with the map.
   */
  readonly respectUserInteraction?: boolean;
}

export default function SmartRecenterUserAndSitter({
  enabled = true,
  userPosition,
  sitterPosition,
  minZoom = 1,
  maxZoom = 18,
  paddingPx = 80,
  flyDuration = 1.8,
  respectUserInteraction, // kept for future extensibility
}: Readonly<SmartRecenterUserAndSitterProps>) {
  const map = useMap();

  useEffect(() => {
    if (!sitterPosition || !isValidLatLng(sitterPosition)) {
      return;
    }

    // โหมด "shop-focused" (enabled = false): fly ไปที่ร้านอย่างเดียว
    if (!enabled) {
      const sitterLatLng = sitterPosition as LatLngExpression;
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, minZoom);
      map.flyTo(sitterLatLng, targetZoom, {
        animate: true,
        duration: flyDuration,
      });
      return;
    }

    // โหมด "follow me + shop together" (enabled = true)
    // Case 1: ไม่มี user geolocation → recenter ไปที่หมุดร้านอย่างเดียว
    if (!userPosition) {
      const sitterLatLng = sitterPosition as LatLngExpression;

      const currentBounds = map.getBounds();
      const paddedBounds = currentBounds.pad(0);

      if (paddedBounds.contains(sitterLatLng)) {
        return;
      }

      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, minZoom);

      map.flyTo(sitterLatLng, targetZoom, {
        animate: true,
        duration: flyDuration,
      });

      return;
    }

    // Case 2: มีทั้ง user + sitter → ใช้ fitBounds ให้เห็นทั้งสองหมุดใน viewport เดียวกัน
    if (!isValidLatLng(userPosition)) {
      return;
    }
    const userLatLng = userPosition as LatLngTuple;
    const sitterLatLng = sitterPosition as LatLngTuple;

    const bounds = [userLatLng, sitterLatLng] as [LatLngTuple, LatLngTuple];

    map.fitBounds(bounds, {
      padding: [paddingPx, paddingPx],
      animate: true,
      duration: flyDuration,
      maxZoom,
    });

    const currentZoom = map.getZoom();
    const clampedZoom = Math.min(currentZoom, maxZoom);

    if (clampedZoom !== currentZoom) {
      map.setZoom(clampedZoom);
    }
  }, [
    map,
    enabled,
    userPosition,
    sitterPosition,
    minZoom,
    maxZoom,
    paddingPx,
    flyDuration,
    respectUserInteraction,
  ]);

  return null;
}

