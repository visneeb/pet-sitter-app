"use client";

import { useCallback, useEffect, useState } from "react";
import { ActionButton, ButtonVariant } from "../ui/Button";
import useGeolocation from "@/hooks/map/useGeolocation";
import { MapMarkerIcon } from "@/assets/icons/components";
import { showCustomToast } from "../ui/toast/Toast";
import cn from "@/utils/cn";

type LatLngTuple = readonly [number, number];

type GoogleMapsDirectionsProps = Readonly<{
  destination?: LatLngTuple;
  origin?: LatLngTuple;
  /**
   * If `origin` is not provided, clicking the button will request geolocation
   * and then open Google Maps directions.
   */
  requestGeolocationOnClick?: boolean;
  buttonLabel?: string;
  hoverLabel?: string;
  iconOnly?: boolean;
  showButton?: boolean;
  classnameProp?: string;
  variant?: ButtonVariant;
}>;

export default function GoogleMapsDirections({
  origin,
  destination,
  requestGeolocationOnClick,
  buttonLabel = "Map Routing",
  hoverLabel,
  iconOnly = false,
  classnameProp,
  showButton = true,
  variant = "secondary",
}: GoogleMapsDirectionsProps) {
  const { userPosition, handleLocate, loading, errorMessage } =
    useGeolocation();
  const [openRequestId, setOpenRequestId] = useState(0);

  const resolvedOrigin = origin ?? userPosition ?? undefined;

  const openDirections = useCallback(
    (start: LatLngTuple) => {
      const originStr = `${start[0]},${start[1]}`;
      const destinationStr = `${destination?.[0]},${destination?.[1]}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}`;
      window.open(url, "_blank");
    },
    [destination],
  );

  useEffect(() => {
    if (openRequestId <= 0) return;
    if (!resolvedOrigin) {
      if (errorMessage)
        showCustomToast({
          title: "Permission for location is required",
          description:
            "Please grant permission for location to open directions",
          variant: "error",
          position: "top-center",
        });
      return;
    }
    if (!destination) return;
    openDirections(resolvedOrigin);
  }, [openRequestId, resolvedOrigin, openDirections, destination]);

  const handleClick = () => {
    // If origin is provided, no need to request geolocation.
    if (origin) {
      openDirections(origin);
      return;
    }

    if (!requestGeolocationOnClick) return;

    setOpenRequestId((prev) => prev + 1);
    handleLocate();
  };

  if (!showButton) return null;

  const isDisabled = loading || (!origin && !requestGeolocationOnClick);

  //Edit hover style to include icon.

  return (
    <ActionButton
      type="button"
      variant={variant}
      className={cn(
        "flex text-orange-500 gap-0.5 hover:text-orange-400",
        iconOnly &&
          "group min-w-0! w-10! h-10! p-0! overflow-hidden justify-center transition-all duration-200 hover:w-56! hover:px-3! hover:justify-start",
        classnameProp,
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label="Open directions in Google Maps"
    >
      <MapMarkerIcon className="h-6 w-6 shrink-0" />
      {iconOnly ? (
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-40 group-hover:opacity-100">
          {hoverLabel ?? "View on google maps"}
        </span>
      ) : (
        <p>{buttonLabel}</p>
      )}
    </ActionButton>
  );
}
