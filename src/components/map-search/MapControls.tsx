import { useEffect, useMemo, useState } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import useUserLocate from "@/hooks/map/useUserLocate";
import UserMarker from "../Map/ui/PinIcon/UserMarker";
import ButtonLocate from "../Map/ui/Button/ButtonLocate";
import ButtonToggleLock from "../Map/ui/Button/ButtonToggleLock";
import ButtonZoomIn from "../Map/ui/Button/ButtonZoomIn";
import ButtonZoomOut from "../Map/ui/Button/ButtonZoomOut";
import ButtonFullscreen from "../Map/ui/Button/ButtonFullscreen";
import ButtonRoute from "../Map/ui/Button/ButtonRoute";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import SitterMarker from "../Map/ui/Marker/SitterMarker";
import SmartRecenterUserAndSitter from "../Map/SmartRecenterUserAndSitter";
import { isValidLatLng } from "@/utils/map";
import type { PetSitterDetail } from "@/hooks/search/map/useSelectMaker";
import useOsrmRoute, {
  type LatLngTuple as OsrmLatLngTuple,
} from "@/hooks/map/useOsrmRoute";

export interface MapControlsProps {
  readonly selectedMarker: PetSitterDetail | null;
  readonly handleSelectPetSitter: (petSitter: PetSitterDetail) => void;
}

// hook อยู่ที่นี่ที่เดียว — เป็น single source of truth สำหรับ userPosition และ accuracy
export default function MapControls({
  selectedMarker,
  handleSelectPetSitter,
}: Readonly<MapControlsProps>) {
  const { userPosition, accuracy, loading, handleLocate } = useUserLocate();
  const { petSitters } = usePetSitterSearch();
  const [lockUserAndSitter, setLockUserAndSitter] = useState(false);
  const [routeEnabled, setRouteEnabled] = useState(false);
  const [displayDistanceKm, setDisplayDistanceKm] = useState<number | null>(null);
  const {
    loading: routeLoading,
    error: routeError,
    routeCoords,
    routeDistanceKm,
    fetchRoute,
  } = useOsrmRoute();

  const sitterPosition: OsrmLatLngTuple | null = useMemo(() => {
    if (!selectedMarker?.position || !isValidLatLng(selectedMarker.position)) {
      return null;
    }
    return selectedMarker.position as OsrmLatLngTuple;
  }, [selectedMarker]);

  const userLatLng: OsrmLatLngTuple | null = useMemo(() => {
    if (!userPosition || !isValidLatLng(userPosition)) {
      return null;
    }
    return userPosition as OsrmLatLngTuple;
  }, [userPosition]);

  useEffect(() => {
    if (routeDistanceKm !== null) {
      setTimeout(() => {
        setDisplayDistanceKm(routeDistanceKm);
      }, 0);
    }
  }, [routeDistanceKm]);

  // เมื่อเปิดโหมดเส้นทาง ให้คำนวณเส้นใหม่ทุกครั้งที่ user หรือ sitter เปลี่ยน
  useEffect(() => {
    if (!routeEnabled) return;
    if (!userLatLng || !sitterPosition || routeLoading) return;

    void fetchRoute(userLatLng, sitterPosition);
  }, [routeEnabled, userLatLng, sitterPosition, routeLoading, fetchRoute]);

  const handleToggleRoute = () => {
    setRouteEnabled((prev) => {
      console.log("toggle route", prev);
      // ถ้ากำลังจะ "เปิด" โหมดเส้นทาง แต่ไม่มีตำแหน่ง user หรือ sitter ให้ ignore คลิกนี้ไป
      if (!prev && (!userLatLng || !sitterPosition)) {
        return prev;
      }
      const next = !prev;


      // เมื่อเปิดโหมดเส้นทาง ให้แสดงทั้ง user + sitter
      if (next && !lockUserAndSitter) {
        setLockUserAndSitter(true);
      }

      // เมื่อปิดโหมดเส้นทาง ให้เคลียร์ค่าระยะที่แสดง
      if (!next) {
        setDisplayDistanceKm(null);
      }

      return next;
    });
  };

  const handleLocateWithLock = () => {
    // เมื่อกดปุ่ม locate ให้โฟกัสทั้ง user + sitter (ถ้ามี sitter)
    if (sitterPosition && !lockUserAndSitter) {
      setLockUserAndSitter(true);
    }
    handleLocate();
  };

  return (
    <>
      {/* Marker ตำแหน่งร้าน */}
      {petSitters.map((item) => {
        const position: [number, number] = [item.latitude, item.longitude];
        if (!isValidLatLng(position)) return null;
        return (
          <SitterMarker
            key={item.id}
            position={position}
            selected={selectedMarker?.id === item.id}
            onClick={() =>
              handleSelectPetSitter({
                id: item.id,
                position,
                selected: true,
              })
            }
          />
        );
      })}
      {/* Marker ตำแหน่งผู้ใช้ — แสดงเมื่อมีตำแหน่งและ accuracy แล้วเท่านั้น */}
      {userPosition && accuracy !== null && isValidLatLng(userPosition) && (
        <UserMarker position={userPosition} accuracy={accuracy} />
      )}
      {/* SmartRecenterUserAndSitter สำหรับการโฟกัสที่ตำแหน่งผู้ใช้และร้าน */}
      <SmartRecenterUserAndSitter
        enabled={lockUserAndSitter}
        userPosition={
          userPosition && isValidLatLng(userPosition) ? userPosition : null
        }
        sitterPosition={
          selectedMarker?.position && isValidLatLng(selectedMarker.position)
            ? selectedMarker.position
            : null
        }
        minZoom={10}
        maxZoom={18}
        paddingPx={80}
      />

      {/* Button Controls */}
      <div className="absolute top-4 right-4 z-1000 flex flex-row gap-2 pointer-events-none">
        <ButtonToggleLock
          active={lockUserAndSitter}
          onToggle={() => setLockUserAndSitter((v) => !v)}
        />
        <ButtonLocate loading={loading} handleLocate={handleLocateWithLock} />
        <ButtonRoute
          onClick={handleToggleRoute}
          disabled={!routeEnabled && (!userLatLng || !sitterPosition)}
          loading={routeLoading}
          active={routeEnabled}
        />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonFullscreen />
      </div>

      {/* Route polyline */}
      {routeEnabled && routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords as LatLngTuple[]}
          pathOptions={{ color: "#2563EB", weight: 5 }}
        />
      )}

      {/* Route distance popup */}
      {routeEnabled && (
        <section className="absolute top-4 left-4 z-1000 pointer-events-none">
          <div className="pointer-events-auto rounded-lg bg-white/90 px-3 py-2 text-sm shadow">
            {routeLoading && displayDistanceKm === null && (
              <>Calculating route distance...</>
            )}
            {!routeLoading && displayDistanceKm !== null && (
              <>
                The distance according to the route is approximately{" "}
                {displayDistanceKm.toFixed(2)} km.
              </>
            )}
            {routeLoading && displayDistanceKm !== null && (
              <>
                The distance according to the route is approximately{" "}
                {displayDistanceKm.toFixed(2)} km.
              </>
            )}
          </div>
        </section>
      )}

      {/* Route error message */}
      {routeEnabled && routeError && (
        <section className="absolute top-20 left-4 z-1000 pointer-events-none">
          <div className="pointer-events-auto rounded-lg bg-red-600 px-3 py-2 text-sm text-white shadow">
            Cannot calculate route: {routeError}
          </div>
        </section>
      )}
    </>
  );
}
