import { useScreenContext } from "@/contexts/ScreenContext";
import { HeroLeftPanel } from "./HeroSection/HeroLeftPanel";
import { HeroRightPanel } from "./HeroSection/HeroRightPanel";
import { HeroTextContent } from "./HeroSection/HeroTextContent";
import cn from "@/utils/cn";
import TestResponsive from "../search/testResponsive";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const { isSmall,isMedium } = useScreenContext();

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
  const PANEL_NATURAL_WIDTH = 400;
  const PANEL_NATURAL_HEIGHT = 500;
  const panelScale =
    windowWidth > 0 ? (windowWidth * 0.5) / PANEL_NATURAL_WIDTH : 0.57;
  const scaledWidth = PANEL_NATURAL_WIDTH * panelScale;
  const scaledHeight = PANEL_NATURAL_HEIGHT * panelScale;

  return (
    <>
      {isWideScreen ? (
        <section
          className={cn("flex flex-row justify-center items-center flex-row")}
        >
          <HeroLeftPanel />
          <HeroTextContent />
          <HeroRightPanel />
        </section>
      ) : (
        <section
          className={cn(
            "flex flex-col justify-center items-center flex-col gap-[50px]",
          )}
        >
          <HeroTextContent />
          <div
            className={cn(
              "flex flex-row justify-center items-center",
              
            )}
          >
            {(isSmall&&isMedium) ? (
              <>
                <HeroLeftPanel />
                <HeroRightPanel />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
