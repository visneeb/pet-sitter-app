"use client";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import ServiceCard from "@/components/home/ServiceCard";
import FeatureCard from "@/components/home/FeatureCard";
import PerfectPetSitterSection from "@/components/home/PerfectPetSitterSection";
import { services, features, PetImage } from "@/constants/homeContent";
import SearchBar from "@/components/home/SearchBar";
import HeroSection from "@/components/home/HeroSection";
import { PetSitterSearchProvider } from "@/contexts/PetSitterSearchContext";

const servicesContainerClassName =
  "flex flex-col items-center md:flex-row justify-between mx-auto max-w-[1064px] gap-24 px-4";
const featuresContainerClassName =
  "flex flex-col md:flex-row justify-center max-w-[1280px] mx-auto gap-10 md:gap-4";

function ScrollReveal({
  children,
  className,
  delayMs = 0,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { isMedium } = useScreenContext();

  return (
    <>
      <div className="pt-10 xl:pt-20">
        <section id="Hero-Section" className="w-full">
          <HeroSection />
        </section>
        <section id="search" className="w-full mt-4 md:mt-8">
          <Suspense>
            <PetSitterSearchProvider enableQuery={false}>
              <SearchBar />
            </PetSitterSearchProvider>
          </Suspense>
        </section>
      </div>
      <section className="flex flex-col gap-10 md:gap-32 px-4 md:px-20 pb-10 md:p-20">
        <ScrollReveal>
          <h1 className="flex text-center justify-center text-balance style-headline-3 md:style-headline-2 px-4 ">
            "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
          </h1>
        </ScrollReveal>

        <div className={servicesContainerClassName}>
          <ScrollReveal className="flex-5 max-w-[504px]" delayMs={80}>
            <div className="flex flex-col gap-6 md:gap-14">
              {services.map((service, index) => (
                <ScrollReveal key={service.title} delayMs={index * 120}>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    iconColor={service.iconColor}
                  />
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal className="hidden flex-4 lg:block" delayMs={140}>
            <Image src={PetImage} alt="Pet Image" className="object-cover" />
          </ScrollReveal>
        </div>
        <ScrollReveal className="block place-self-center mb-1 lg:hidden" delayMs={120}>
          <Image src={PetImage} alt="Pet Image" className="object-cover" />
        </ScrollReveal>

        <div className={featuresContainerClassName}>
          {features.map((feature, index) => (
            <ScrollReveal key={feature.id} delayMs={160 + index * 120}>
              <FeatureCard
                image={feature.image}
                alt={feature.alt}
                highlightedWord={feature.highlightedWord}
                restOfTitle={feature.restOfTitle}
                highlightColor={feature.highlightColor}
                description={feature.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <PerfectPetSitterSection />
    </>
  );
}
