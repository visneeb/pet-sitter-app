import Image from "next/image";
import { EllipseSector, FullEllipse, HalfEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";
import {
  DOG_IMAGE_HEIGHT,
  DOG_IMAGE_LEFT,
  DOG_IMAGE_TOP,
  DOG_IMAGE_WIDTH,
  DOG_SECTOR_LEFT,
  DOG_SECTOR_SIZE,
  DOG_SECTOR_TOP,
  GRAY_ELLIPSE_LEFT,
  GRAY_ELLIPSE_SIZE,
  GRAY_ELLIPSE_TOP,
  HALF_ELLIPSE_HEIGHT,
  HALF_ELLIPSE_LEFT,
  HALF_ELLIPSE_WIDTH,
  HERO_DOG_IMAGE,
  RIGHT_PANEL_HEIGHT,
  RIGHT_PANEL_WIDTH,
  STAR_LEFT,
  STAR_SIZE,
  STAR_TOP,
} from "@/constants/HomepageData/HeroSection";
import cn from "@/utils/cn";

export function HeroRightPanel({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: RIGHT_PANEL_WIDTH, height: RIGHT_PANEL_HEIGHT }}
    >
      {/* Orange Star - top left */}
      <Star
        className="absolute z-10 text-orange-500"
        style={{
          width: STAR_SIZE,
          height: STAR_SIZE,
          top: STAR_TOP,
          left: STAR_LEFT,
        }}
      />

      {/* Gray full ellipse decoration */}
      <FullEllipse
        className="absolute z-0 text-gray-100"
        style={{
          width: GRAY_ELLIPSE_SIZE,
          height: GRAY_ELLIPSE_SIZE,
          top: GRAY_ELLIPSE_TOP,
          left: GRAY_ELLIPSE_LEFT,
        }}
      />

      {/* Yellow EllipseSector - behind the dog */}
      <EllipseSector
        className="absolute z-0 text-yellow-200"
        style={{
          width: DOG_SECTOR_SIZE,
          height: DOG_SECTOR_SIZE,
          top: DOG_SECTOR_TOP,
          left: DOG_SECTOR_LEFT,
        }}
      />

      {/* Dog image - clipped as circle, in front of EllipseSector */}
      <Image
        src={HERO_DOG_IMAGE}
        alt="Dog wearing glasses"
        width={DOG_IMAGE_WIDTH}
        height={DOG_IMAGE_HEIGHT}
        className="absolute z-10"
        style={{
          top: DOG_IMAGE_TOP,
          left: DOG_IMAGE_LEFT,
          clipPath: "circle(50%)",
        }}
      />

      {/* Green HalfEllipse - bottom center */}
      <HalfEllipse
        className="absolute top-[326px] z-0 text-green-500"
        style={{
          width: HALF_ELLIPSE_WIDTH,
          height: HALF_ELLIPSE_HEIGHT,
          left: HALF_ELLIPSE_LEFT,
        }}
      />
    </div>
  );
}
