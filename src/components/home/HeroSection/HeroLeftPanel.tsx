import Image from "next/image";
import { Dots } from "@/decorations/Dots";
import { QuadrantEllipse } from "@/decorations/Ellipse";
import { Paw } from "@/decorations/Paw";
import { EllipseCut } from "@/decorations/Shapes";
import {
  CAT_GROUP_LEFT,
  CAT_GROUP_TOP,
  CAT_IMAGE_SIZE,
  DOTS_HEIGHT,
  DOTS_RIGHT,
  DOTS_TOP,
  DOTS_WIDTH,
  ELLIPSE_CUT_SIZE,
  HERO_CAT_IMAGE,
  LEFT_PANEL_HEIGHT,
  LEFT_PANEL_WIDTH,
  PAW_RIGHT,
  PAW_SIZE,
  PAW_TOP,
  QUADRANT_RIGHT,
  QUADRANT_SIZE,
  QUADRANT_TOP,
} from "@/constants/HomepageData/HeroSection";
import cn from "@/utils/cn";

export function HeroLeftPanel({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: LEFT_PANEL_WIDTH, height: LEFT_PANEL_HEIGHT }}
    >
      {/* Pink Paw - top right */}
      <Paw
        className="absolute z-10 text-pink-500"
        style={{
          width: PAW_SIZE,
          height: PAW_SIZE,
          top: PAW_TOP,
          right: PAW_RIGHT,
        }}
      />

      {/* Yellow QuadrantEllipse - left side */}
      <QuadrantEllipse
        className="absolute z-0 text-yellow-200"
        style={{
          width: QUADRANT_SIZE,
          height: QUADRANT_SIZE,
          top: QUADRANT_TOP,
          right: QUADRANT_RIGHT,
        }}
      />

      {/* Blue Dots - center left */}
      <Dots
        className="absolute z-20"
        style={{
          width: DOTS_WIDTH,
          height: DOTS_HEIGHT,
          top: DOTS_TOP,
          right: DOTS_RIGHT,
        }}
        bgClassName="text-blue-100"
        dotClassName="text-blue-500"
      />

      {/* Blue EllipseCut ring + Cat image */}
      <div
        className="absolute z-10"
        style={{ top: CAT_GROUP_TOP, left: CAT_GROUP_LEFT }}
      >
        <div className="relative">
          <EllipseCut
            className="text-blue-500"
            style={{ width: ELLIPSE_CUT_SIZE, height: ELLIPSE_CUT_SIZE }}
          />
          <Image
            src={HERO_CAT_IMAGE}
            alt="Cute pet"
            width={CAT_IMAGE_SIZE}
            height={CAT_IMAGE_SIZE}
            className="absolute bottom-0 right-0 z-10"
          />
        </div>
      </div>
    </div>
  );
}
