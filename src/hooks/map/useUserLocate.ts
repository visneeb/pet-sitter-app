import { useState } from "react";
import { useMap } from "react-leaflet";

// ต้องถูกเรียกข้างใน <MapContainer> เท่านั้น เพราะใช้ useMap()
export default function useUserLocate() {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  // accuracy: รัศมีความแม่นยำของ GPS ในหน่วยเมตร (null = ยังไม่มีข้อมูล)
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setErrorMessage(["This bronwser does not support Geolocation"]);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy: gpsAccuracy } = pos.coords;
        const userPos: [number, number] = [latitude, longitude];

        // เลื่อน map ไปยังตำแหน่งผู้ใช้
        map.flyTo(userPos, 15, { animate: true, duration: 0.5 });

        // เก็บตำแหน่งและ accuracy ใน state ของ hook เอง
        setUserPosition(userPos);
        setAccuracy(gpsAccuracy);
        setLoading(false);
      },
      (err) => {
        setErrorMessage(["Could not get your location: " + err.message]);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return { loading, userPosition, accuracy, errorMessage, handleLocate };
}
