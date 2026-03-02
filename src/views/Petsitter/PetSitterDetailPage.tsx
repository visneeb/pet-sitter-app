"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "@/utils/cn";

const images = [
  {
    src: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1600&auto=format&fit=crop",
    alt: "Woman sitting with husky",
  },
  {
    src: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1600&auto=format&fit=crop",
    alt: "Golden retriever on a bed",
  },
  {
    src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
    alt: "Cat relaxing on a sofa",
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop",
    alt: "Dog outside",
  },
];

export default function PetSitterDetailPage() {
  const total = images.length;
  const transitionMs = 500;
  const transitionDelayMs = 80;

  const [mobileIndex, setMobileIndex] = useState(1);
  const [desktopIndex, setDesktopIndex] = useState(1);
  const [isMobileAnimating, setIsMobileAnimating] = useState(true);
  const [isDesktopAnimating, setIsDesktopAnimating] = useState(true);

  const activeIndex = useMemo(
    () => (mobileIndex - 1 + total) % total,
    [mobileIndex, total],
  );

  const mobileSlides = useMemo(
    () => [images[total - 1], ...images, images[0]],
    [total],
  );

  const desktopSlides = useMemo(
    () => [...images.slice(-2), ...images, ...images.slice(0, 2)],
    [],
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

  return (
    <>
      <section className="w-full py-10 md:py-10">
        <div className="relative flex w-full flex-col gap-6">
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
                  key={`${image.src}-${index}`}
                  className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

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
                  key={`${image.src}-${index}`}
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

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-50 hidden items-center justify-between px-6 md:flex">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>
      <div className="w-full md:px-20 md:pt-0">
        <div className="flex flex-col gap-12 md:px-20 md:py-6">
          <h1 className="style-headline-1">Happy House!</h1>
          <div className="flex flex-col gap-3">
            <h3 className="style-headline-3">Introduction</h3>
            <p className="style-body-2 text-gray-500">
              Hello there! My name is Jane Maison, and I'm your friendly and
              reliable pet sitter in Senanikom, Bangkok. I am passionate about
              animals and have dedicated myself to ensuring the well-being and
              happiness of your furry, feathery, and hoppy companions. With a
              big heart and a spacious house, I provide a safe and loving
              environment for cats, dogs, and rabbits while you're away. Let me
              introduce myself and tell you a bit more about the pet care
              services I offer.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="style-headline-3">Services</h3>
            <p className="style-body-2 text-gray-500">
              🐱 Cat Sitting: Cats are fascinating creatures, and I take joy in
              catering to their independent yet affectionate nature. Whether
              your feline friend needs playtime, cuddles, or just a cozy spot to
              relax, I ensure they feel right at home. <br /> 🐶 Dog Sitting:
              Dogs are not just pets; they're family. From energetic walks and
              engaging playtime to soothing belly rubs, I provide a balanced and
              fun experience for dogs of all sizes and breeds. Safety and
              happiness are my top priorities. <br />
              🐇 Rabbit Sitting: With their adorable antics and gentle
              personalities, rabbits require a special kind of care. I am
              well-versed in providing them with a comfortable environment,
              appropriate diet, and ample playtime to keep them content and
              hopping with joy.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="style-headline-3">My places</h3>
            <p className="style-body-2 text-gray-500">
              My residence is a spacious house nestled in the serene
              neighborhood of Senanikom. Your beloved pets will have plenty of
              room to roam and explore while enjoying a safe and secure
              environment. I have designated areas for play, relaxation, and
              sleep, ensuring your pets feel comfortable and at ease throughout
              their stay.
            </p>
          </div>
        </div>
      </div>
      
    </>
  );
}
