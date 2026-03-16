"use client";

import Image from "next/image";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goLightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i <= 0 ? total - 1 : i - 1));
  }, [total]);

  const goLightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i >= total - 1 ? 0 : i + 1));
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goLightboxPrev();
      if (e.key === "ArrowRight") goLightboxNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, goLightboxPrev, goLightboxNext]);

  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

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
    "pointer-events-auto flex h-14 w-14 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white";

  const EmptySlot = () => (
    <div
      className="relative flex aspect-4/3 w-full items-center justify-center bg-gray-200 overflow-hidden"
      aria-label="ไม่มีรูปภาพ"
    >
      <ImageOff className="text-white size-12 sm:size-16 lg:size-20" />
    </div>
  );

  if (total === 0) {
    return (
      <div className="relative flex w-full flex-col gap-6">
        {/* Mobile: 1 placeholder */}
        <div className="relative w-full overflow-hidden lg:hidden">
          <EmptySlot />
        </div>
        {/* Desktop: 3 placeholders - same layout as carousel */}
        <div className="relative hidden w-full overflow-hidden lg:block">
          <div className="flex w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative flex w-1/3 shrink-0 justify-center px-2"
              >
                <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-sm">
                  <ImageOff className="text-white size-16 sm:size-20 lg:size-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-6">
      {/* Mobile carousel (1 slide) */}
      <div className="relative overflow-hidden lg:hidden">
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
          {mobileSlides.map((image, index) => {
            const imageIndex =
              index >= 1 && index <= total
                ? index - 1
                : index === 0
                  ? total - 1
                  : 0;
            return (
              <button
                type="button"
                key={`${image.src}-mobile-${index}`}
                onClick={() => openLightbox(imageIndex)}
                className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-100 shadow-sm cursor-zoom-in text-left"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 0px"
                  className="object-cover"
                  priority={index === mobileIndex}
                />
              </button>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-50">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className={navButtonClass}
          >
            <ChevronLeft className="h-10 w-10 lg:h-6 lg:w-6 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className={navButtonClass}
          >
            <ChevronRight className="h-10 w-10 lg:h-6 lg:w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop carousel (3 slides) */}
      <div className="relative hidden w-full overflow-hidden lg:block">
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
          {desktopSlides.map((image, index) => {
            const imageIndex = ((index - 2) % total + total) % total;
            return (
              <button
                type="button"
                key={`${image.src}-desktop-${index}`}
                onClick={() => openLightbox(imageIndex)}
                className="relative flex w-1/3 shrink-0 justify-center px-2 cursor-zoom-in text-left"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 0px"
                    className="object-cover"
                    priority={index === desktopIndex + 1}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop nav buttons overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-50 hidden items-center justify-between px-6 lg:flex">
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="ขยายรูป"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="ปิด"
          >
            <X className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goLightboxPrev(); }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="รูปก่อนหน้า"
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goLightboxNext(); }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="รูปถัดไป"
          >
            <ChevronRight className="size-8" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1920}
              height={1080}
              className="max-h-[90vh] w-auto max-w-full object-contain"
              unoptimized={images[lightboxIndex].src.startsWith("data:")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
