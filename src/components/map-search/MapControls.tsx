import { useState } from "react";
import useUserLocate from "@/hooks/map/useUserLocate";
import UserMarker from "../Map/ui/PinIcon/UserMarker";
import ButtonLocate from "../Map/ui/Button/ButtonLocate";
import ButtonToggleLock from "../Map/ui/Button/ButtonToggleLock";
import ButtonZoomIn from "../Map/ui/Button/ButtonZoomIn";
import ButtonZoomOut from "../Map/ui/Button/ButtonZoomOut";
import ButtonFullscreen from "../Map/ui/Button/ButtonFullscreen";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import SitterMarker from "../Map/ui/Marker/SitterMarker";
import SmartRecenterUserAndSitter from "../Map/SmartRecenterUserAndSitter";
import { isValidLatLng } from "@/utils/map";
import type { PetSitterDetail } from "@/hooks/search/map/useSelectMaker";

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

  return (
    <>
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
      {userPosition &&
        accuracy !== null &&
        isValidLatLng(userPosition) && (
          <UserMarker position={userPosition} accuracy={accuracy} />
        )}

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
        <ButtonLocate loading={loading} handleLocate={handleLocate} />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonFullscreen />
      </div>
    </>
  );
}
