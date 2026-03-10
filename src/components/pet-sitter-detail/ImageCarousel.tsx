"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "@/utils/cn";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  transitionMs?: number;
  transitionDelayMs?: number;
}

export default function ImageCarousel({
  images,
  transitionMs = 500,
  transitionDelayMs = 80,
}: ImageCarouselProps) {
  const total = images.length;
  const [mobileIndex, setMobileIndex] = useState(1);
  const [desktopIndex, setDesktopIndex] = useState(1);
  const [isMobileAnimating, setIsMobileAnimating] = useState(true);
  const [isDesktopAnimating, setIsDesktopAnimating] = useState(true);

  const mobileSlides = useMemo(
    () => [images[total - 1], ...images, images[0]],
    [images, total],
  );

  const desktopSlides = useMemo(
    () => [...images.slice(-2), ...images, ...images.slice(0, 2)],
    [images],
  );

  const goPrev = () => {
    setIsMobileAnimating(true);
    setIsDesktopAnimating(true);
    setMobileIndex((current) => (current <= 0 ? current : current - 1));
    setDesktopIndex((current) => (current <= 0 ? current : current - 1));
  };

  const goNext = () => {
    setIsMobileAnimating(true);
    setIsDesktopAnimating(true);
    setMobileIndex((current) => (current >= total + 1 ? current : current + 1));
    setDesktopIndex((current) =>
      current >= total + 1 ? current : current + 1,
    );
  };

  const handleMobileTransitionEnd = () => {
    if (mobileIndex === 0) {
      setIsMobileAnimating(false);
      setMobileIndex(total);
      setTimeout(() => setIsMobileAnimating(true), 0);
    }
    if (mobileIndex === total + 1) {
      setIsMobileAnimating(false);
      setMobileIndex(1);
      setTimeout(() => setIsMobileAnimating(true), 0);
    }
  };

  const handleDesktopTransitionEnd = () => {
    if (desktopIndex === 0) {
      setIsDesktopAnimating(false);
      setDesktopIndex(total);
      setTimeout(() => setIsDesktopAnimating(true), 0);
    }
    if (desktopIndex === total + 1) {
      setIsDesktopAnimating(false);
      setDesktopIndex(1);
      setTimeout(() => setIsDesktopAnimating(true), 0);
    }
  };

  const navButtonClass =
    "pointer-events-auto flex h-14 w-14 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white";

  return (
    <div className="relative flex w-full flex-col gap-6">
      {/* Mobile carousel (1 slide) */}
      <div className="relative overflow-hidden md:hidden">
        <div
          className={cn(
            "flex w-full",
            isMobileAnimating &&
              "transition-transform ease-in-out duration-500",
          )}
          onTransitionEnd={handleMobileTransitionEnd}
          style={{
            transform: `translateX(-${mobileIndex * 100}%)`,
            transitionDuration: `${transitionMs}ms`,
            transitionDelay: isMobileAnimating
              ? `${transitionDelayMs}ms`
              : "0ms",
          }}
        >
          {mobileSlides.map((image, index) => (
            <div
              key={`${image.src}-mobile-${index}`}
              className="relative aspect-4/3 w-full shrink-0 overflow-hidden  bg-gray-100 shadow-sm"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 0px"
                className="object-cover"
                priority={index === mobileIndex}
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-50">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className={navButtonClass}
          >
            <ChevronLeft className="h-10 w-10 md:h-6 md:w-6 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className={navButtonClass}
          >
            <ChevronRight className="h-10 w-10 md:h-6 md:w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop carousel (3 slides) */}
      <div className="relative hidden w-full overflow-hidden md:block">
        <div
          className={cn(
            "flex w-full",
            isDesktopAnimating &&
              "transition-transform ease-in-out duration-500",
          )}
          onTransitionEnd={handleDesktopTransitionEnd}
          style={{
            transform: `translateX(-${desktopIndex * (100 / 3)}%)`,
            transitionDuration: `${transitionMs}ms`,
            transitionDelay: isDesktopAnimating
              ? `${transitionDelayMs}ms`
              : "0ms",
          }}
        >
          {desktopSlides.map((image, index) => (
            <div
              key={`${image.src}-desktop-${index}`}
              className="relative aspect-4/3 w-1/3 shrink-0 overflow-hidden bg-gray-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 0px"
                className="object-cover"
                priority={index === desktopIndex + 1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop nav buttons overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-50 hidden items-center justify-between px-6 md:flex">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          className={navButtonClass}
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className={navButtonClass}
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
