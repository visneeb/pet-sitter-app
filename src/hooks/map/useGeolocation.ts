import { useCallback, useState } from "react";

type LatLngTuple = [number, number];

export default function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<LatLngTuple | null>(null);

  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage(["This browser does not support Geolocation"]);
      
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy: gpsAccuracy } = pos.coords;
        const userPos: LatLngTuple = [latitude, longitude];

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
  }, []);

  return { loading, userPosition, accuracy, errorMessage, handleLocate };
}

