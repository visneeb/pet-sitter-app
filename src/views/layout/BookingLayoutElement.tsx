import Image from "next/image";
import catBooking from "@/assets/booking-page/cat-booking.svg";
import { EllipseSector } from "@/decorations/Ellipse";
import { elementStyle } from "./BookingLayoutInner";

export function CatInCircle() {
  return (
    <div className={`relative ${elementStyle}`}>
      <Image
        src={catBooking}
        alt="cat"
        className="absolute z-1 -top-3 left-1"
        style={{
          width: "226px",
          height: "226px",
          clipPath: "circle(50% at 42.5% 48%)",
        }}
      />
      <EllipseSector className="size-55 text-yellow-200 rotate-45" />
    </div>
  );
}
