// ── Custom Control: ปุ่มขอตำแหน่งปัจจุบัน ──────────────────────────────────

import { Locate, Navigation } from "lucide-react";

import MapIconButton from "./MapIconButton";

interface ButtonLocateProps {
  readonly loading: boolean;
  readonly handleLocate: () => void;
}

export default function ButtonLocate({
  loading,
  handleLocate,
}: Readonly<ButtonLocateProps>) {
  return (
    <div className="leaflet-control">
      <MapIconButton
        onClick={handleLocate}
        disabled={loading}
        title="My location"
      >
        {loading ? (
          <Locate size={20} color="#7B7E8F" />
        ) : (
          <Navigation size={20} color="#7B7E8F" />
        )}
      </MapIconButton>
    </div>
  );
}
