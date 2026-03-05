"use client";

// src/components/Map/ui/Input/ZipSearchMap.tsx
//
// input กรอกรหัสไปรษณีย์ไทย + ปุ่ม search
// - fetch Nominatim API เพื่อดึง bounding-box ของรหัสไปรษณีย์
// - แสดงกรอบ Rectangle บนแผนที่ + fly ไปยังตำแหน่งนั้น
// - rate-limit ≥ 1 วินาทีต่อ request
// - กรอบหายทันทีที่ user ลาก/ซูมแผนที่

import { useState, KeyboardEvent } from "react";
import { Rectangle } from "react-leaflet";
import { Search, Loader2, X } from "lucide-react";
import useZipSearch from "@/hooks/map/useZipSearch";

// ── Styles (inline, ไม่พึ่ง className จาก Tailwind เพื่อ leaflet overlay ──────
const containerStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  pointerEvents: "auto",
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(6px)",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
  padding: "6px 8px 6px 14px",
  gap: "6px",
  minWidth: "220px",
};

const inputStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "#1a1a2e",
  width: "140px",
  fontFamily: "inherit",
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "8px",
  color: "#7B7E8F",
  transition: "background 0.15s",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function ZipSearchMap() {
  const [inputValue, setInputValue] = useState("");
  const { bounds, status, errorMsg, searchByZip, clearBounds } = useZipSearch();

  const isLoading = status === "loading";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    if (!inputValue.trim() || isLoading) return;
    searchByZip(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setInputValue("");
      clearBounds();
    }
  };

  const handleClear = () => {
    setInputValue("");
    clearBounds();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ─── Input Control ────────────────────────────────────────────── */}
      <div className="leaflet-top leaflet-left" style={containerStyle}>
        <div className="leaflet-control" style={wrapperStyle}>
          {/* Input */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="รหัสไปรษณีย์ไทย…"
            value={inputValue}
            onChange={(e) =>
              setInputValue(e.target.value.replaceAll(/\D/g, "").slice(0, 5))
            }
            onKeyDown={handleKeyDown}
            style={inputStyle}
            disabled={isLoading}
            aria-label="กรอกรหัสไปรษณีย์"
          />

          {/* Clear button — แสดงเมื่อมีข้อความ */}
          {inputValue.length > 0 && !isLoading && (
            <button
              style={iconBtnStyle}
              onClick={handleClear}
              title="ล้างการค้นหา"
              aria-label="ล้าง"
            >
              <X size={15} />
            </button>
          )}

          {/* Search / Loading button */}
          <button
            style={{
              ...iconBtnStyle,
              color: isLoading ? "#B0B3C6" : "#4A90E2",
            }}
            onClick={handleSearch}
            disabled={isLoading || inputValue.trim().length === 0}
            title="ค้นหาตำแหน่ง"
            aria-label="ค้นหา"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        {/* Error message */}
        {status === "error" && errorMsg && (
          <div
            style={{
              marginTop: "6px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "#e53e3e",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            {errorMsg}
          </div>
        )}
      </div>

      {/* ─── Bounding Box Rectangle ──────────────────────────────────── */}
      {bounds && (
        <Rectangle
          bounds={bounds}
          pathOptions={{
            color: "#4A90E2",
            weight: 2.5,
            fillColor: "#4A90E2",
            fillOpacity: 0.08,
            dashArray: "6 4",
          }}
        />
      )}
    </>
  );
}
