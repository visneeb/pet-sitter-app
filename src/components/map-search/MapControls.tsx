import useUserLocate from "@/hooks/map/useUserLocate";
import UserMarker from "../Map/ui/Marker/UserMarker";
import SitterMarker from "../Map/ui/Marker/SitterMarker";
import ButtonLocate from "../Map/ui/Button/ButtonLocate";
import ButtonZoomIn from "../Map/ui/Button/ButtonZoomIn";
import ButtonZoomOut from "../Map/ui/Button/ButtonZoomOut";
import ButtonFullscreen from "../Map/ui/Button/ButtonFullscreen";
import MapPinHandler from "../Map/ui/MapPinHandler";
import ZipSearchMap from "../Map/ui/Input/ZipSearchMap";

// hook อยู่ที่นี่ที่เดียว — เป็น single source of truth สำหรับ userPosition และ accuracy
export default function MapControls() {
  const { userPosition, accuracy, loading, handleLocate } = useUserLocate();

  return (
    <>
      {/* Marker ตำแหน่งผู้ใช้ — แสดงเมื่อมีตำแหน่งและ accuracy แล้วเท่านั้น */}
      {userPosition && accuracy !== null && (
        <UserMarker position={userPosition} accuracy={accuracy} />
      )}
      {/* Test Custom Marker */}
      {userPosition && accuracy !== null && (
        <SitterMarker position={userPosition} selected={false} />
      )}
      {/* Button Controls */}
      <div
        className="leaflet-top leaflet-right flex flex-row gap-[8px]"
        style={{ marginTop: "10px", marginLeft: "10px" }}
      >
        <ButtonLocate loading={loading} handleLocate={handleLocate} />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonFullscreen />
      </div>
      {/* Zip Code Search Input */}
      <ZipSearchMap />
      {/* Map Pin Handler */}
      <MapPinHandler />
    </>
  );
}
