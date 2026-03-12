import useUserLocate from "@/hooks/map/useUserLocate";
import UserMarker from "../Map/ui/PinIcon/UserMarker";
import ButtonLocate from "../Map/ui/Button/ButtonLocate";
import ButtonZoomIn from "../Map/ui/Button/ButtonZoomIn";
import ButtonZoomOut from "../Map/ui/Button/ButtonZoomOut";
import ButtonFullscreen from "../Map/ui/Button/ButtonFullscreen";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import SitterMarker from "../Map/ui/Marker/SitterMarker";
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

  return (
    <>
      {petSitters.map((item) => (
        <SitterMarker
          key={item.id}
          position={[item.latitude, item.longitude]}
          selected={selectedMarker?.id === item.id}
          onClick={() =>
            handleSelectPetSitter({
              id: item.id,
              position: [item.latitude, item.longitude],
              selected: true,
            })
          }
        />
      ))}
      {/* Marker ตำแหน่งผู้ใช้ — แสดงเมื่อมีตำแหน่งและ accuracy แล้วเท่านั้น */}
      {userPosition && accuracy !== null && (
        <UserMarker position={userPosition} accuracy={accuracy} />
      )}

      {/* Button Controls */}
      <div className="absolute top-4 right-4 z-1000 flex flex-row gap-2 pointer-events-none">
        <ButtonLocate loading={loading} handleLocate={handleLocate} />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonFullscreen />
      </div>
    </>
  );
}
