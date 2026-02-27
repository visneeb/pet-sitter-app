"use client";
import Image from "next/image";
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
  "flex flex-col items-center md:flex-row justify-between mx-auto max-w-[1064px] gap-24";
const featuresContainerClassName =
  "flex flex-col md:flex-row justify-center max-w-[1280px] mx-auto gap-8";

export default function HomePage() {
  const { isMedium } = useScreenContext();

  return (
    <>
      <section id="Hero-Section" className="w-full">
        <HeroSection />
      </section>
      <section id="search" className="w-full">
        <PetSitterSearchProvider>
          <SearchBar />
        </PetSitterSearchProvider>
      </section>
      <section className="flex flex-col gap-32 p-10">
        <h1
          className={cn(
            "flex text-center justify-center",
            isMedium ? "style-headline-2" : "style-headline-3",
          )}
        >
          "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
        </h1>

        <div className={servicesContainerClassName}>
          <div className="flex flex-col gap-14 max-w-[504px]">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                iconColor={service.iconColor}
              />
            ))}
          </div>
          <Image src={PetImage} alt="Pet Image" className="object-cover" />
        </div>

        <div className={featuresContainerClassName}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              image={feature.image}
              alt={feature.alt}
              highlightedWord={feature.highlightedWord}
              restOfTitle={feature.restOfTitle}
              highlightColor={feature.highlightColor}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <PerfectPetSitterSection />
    </>
  );
}
