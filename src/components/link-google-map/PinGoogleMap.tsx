import { MapPinIcon } from "lucide-react";

type Props = Readonly<{
  origin?: readonly [number, number];
  destination?: readonly [number, number];
}>;

export default function PinGoogleMap({ origin, destination }: Props) {
  const goToGoogleMaps = (
    start: readonly [number, number] = [13.7563, 100.5018] as const, // จุดเริ่ม (เช่น Bangkok)
    end: readonly [number, number] = [13.7367, 100.5231] as const, // จุดปลาย
  ) => {
    const originStr = `${start[0]},${start[1]}`;
    const destinationStr = `${end[0]},${end[1]}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}`;

    window.open(url, "_blank"); // เปิดแท็บใหม่
  };
  return (
    <button
      type="button"
      onClick={() => goToGoogleMaps(origin, destination)}
      className="cursor-pointer"
      aria-label="Open directions in Google Maps"
    >
      <MapPinIcon className="w-6 h-6 text-primary" />
    </button>
  );
}
