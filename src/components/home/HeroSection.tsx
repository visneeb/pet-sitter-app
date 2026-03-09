"use client";

import { HeroLeftPanel } from "./HeroSection/HeroLeftPanel";
import { HeroRightPanel } from "./HeroSection/HeroRightPanel";
import { HeroTextContent } from "./HeroSection/HeroTextContent";
import cn from "@/utils/cn";
import { useState, useEffect } from "react";

export default function HeroSection() {


  const [isWideScreen, setIsWideScreen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsWideScreen(window.innerWidth >= 1370);
      setWindowWidth(window.innerWidth);
    };
    update(); // เช็คครั้งแรกเมื่อ mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update); // Cleanup
  }, []);

  // Panel ขนาดจริง 400×500 → ให้กว้าง 50% ของหน้าจอ
  const PANEL_NATURAL_WIDTH = 428;
  const PANEL_NATURAL_HEIGHT = 441;
  const panelScale =
    windowWidth > 0 ? (windowWidth * 0.65) / PANEL_NATURAL_WIDTH : 0.57;
  const scaledWidth = PANEL_NATURAL_WIDTH * panelScale;
  const scaledHeight = PANEL_NATURAL_HEIGHT * panelScale;

  return (
    <>
      <section
        className={cn("hidden xl:flex flex-row justify-center items-center")}
      >
        <HeroLeftPanel />
        <HeroTextContent className="w-[543px] shrink-0"/>
        <HeroRightPanel />
      </section>

      <section
        className={cn(
          "flex xl:hidden flex-col justify-center items-center gap-[50px] overflow-x-hidden w-full",
        )}
      >
        <HeroTextContent />
        <div
          className={cn("hidden sm:flex flex-row justify-center items-center")}
        >
          <HeroLeftPanel />
          <HeroRightPanel />
        </div>
        <div
          className={cn("flex sm:hidden flex-row justify-center items-center")}
        >
          {/* outer wrapper กำหนดพื้นที่ใน layout = ขนาดหลัง scale */}
          <div
            style={{
              width: scaledWidth,
              height: scaledHeight,
              overflow: "hidden",
            }}
          >
            {/* inner div รับ transform แทน โดยไม่ต้องส่ง style prop เข้า Component */}
            <div
              style={{
                transform: `scale(${panelScale})`,
                transformOrigin: "top left",
                width: PANEL_NATURAL_WIDTH,
                height: PANEL_NATURAL_HEIGHT,
              }}
            >
              <HeroLeftPanel />
            </div>
          </div>
          <div
            style={{
              width: scaledWidth,
              height: scaledHeight,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: `scale(${panelScale})`,
                transformOrigin: "top left",
                width: PANEL_NATURAL_WIDTH,
                height: PANEL_NATURAL_HEIGHT,
              }}
            >
              <HeroRightPanel />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
