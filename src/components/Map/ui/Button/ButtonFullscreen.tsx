// ── ButtonFullscreen: ปุ่ม toggle fullscreen สำหรับ map ─────────────────────
// ใช้ Browser Fullscreen API — เหมือนกดปุ่ม fullscreen ตอนดูวิดีโอ
// กด ESC หรือกดปุ่มอีกครั้งเพื่อออก

import { Maximize, Minimize } from "lucide-react";
import { useState, useEffect } from "react";
import MapIconButton from "./MapIconButton";

export default function ButtonFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // sync state กับ browser fullscreen event
  // เพื่อรองรับกรณีผู้ใช้กด ESC เพื่อออก fullscreen เอง
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const handleToggle = () => {
    if (document.fullscreenElement) {
      // ออก fullscreen
      document.exitFullscreen();
    } else {
      // ขอ fullscreen ที่ wrapper ทั้งก้อน (map + slider) แทน map container เดิม
      const wrapper = document.getElementById("map-fullscreen-wrapper");
      wrapper?.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    }
  };

  return (
    <div className="leaflet-control">
      <MapIconButton
        onClick={handleToggle}
        title={isFullscreen ? "ออกจาก Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize size={18} color="#7B7E8F" />
        ) : (
          <Maximize size={18} color="#7B7E8F" />
        )}
      </MapIconButton>
    </div>
  );
}
