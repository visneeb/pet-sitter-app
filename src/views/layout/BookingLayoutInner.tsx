"use client";

import { useBooking } from "@/contexts/BookingContext";
import { Star } from "@/decorations/Shapes";
import { QuadrantEllipse, HalfEllipse } from "@/decorations/Ellipse";
import { Paw } from "@/decorations/Paw";
import { CatInCircle } from "./BookingLayoutElement";

export const elementStyle =
  " absolute opacity-0 md:opacity-100 transition-all duration-300 ease-in-out";

export default function BookingLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isBooked } = useBooking();

  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-1">
        {isBooked ? (
          <>
            <div className="absolute top-20">
              <HalfEllipse
                className={`size-35 text-green-500 left-2 ${elementStyle}`}
              />
              <Paw
                className={`size-25 text-pink-500 top-32 left-20 ${elementStyle}`}
              />
            </div>
            <div className="absolute right-8 bottom-7">
              <Star
                className={`size-30 text-blue-500 rotate-38 left-18 bottom-60 ${elementStyle}`}
              />
              <CatInCircle />
            </div>
          </>
        ) : (
          <>
            <Star
              className={`right-10 -bottom-34 w-64 md:w-80 text-green-500 rotate-38 ${elementStyle}`}
            />
            <QuadrantEllipse
              className={`right-13 bottom-60 w-0 md:w-33 text-blue-500 rotate-45 ${elementStyle}`}
            />
          </>
        )}
      </div>
      {children}
    </>
  );
}
