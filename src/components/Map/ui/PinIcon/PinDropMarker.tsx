import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { PinMarker } from "./PinMarker";

interface PinDropMarkerProps {
  position: [number, number];
  onClose?: () => void;
}

export default function PinDropMarker({
  position,
  onClose,
}: Readonly<PinDropMarkerProps>) {
  // ใช้ createPinIcon หรือ icon อื่นก็ได้
  const svgString = ReactDOMServer.renderToString(
    <PinMarker selected={true} />,
  );
  const icon = L.divIcon({
    className: "bg-transparent",
    html: svgString,
    iconSize: [88, 88],
    iconAnchor: [44, 88],
    popupAnchor: [0, -88],
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup eventHandlers={{ remove: onClose }}>
        <p>📍 ตำแหน่งที่เลือก</p>
        <p>Lat: {position[0].toFixed(5)}</p>
        <p>Lng: {position[1].toFixed(5)}</p>
      </Popup>
    </Marker>
  );
}
