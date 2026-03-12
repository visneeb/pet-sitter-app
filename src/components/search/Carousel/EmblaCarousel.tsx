"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import type { PetSitterDetail } from "@/hooks/search/map/useSelectMaker";
import PetTypesList from "./ui/PetTypesList";
import RatingSitter from "./ui/RatingSitter";
import PicturePlace from "./ui/PicturePlace";
import { useRouter } from "next/navigation";

interface EmblaCarouselProps {
  readonly selectedMarker: PetSitterDetail | null;
  readonly handleSelectPetSitter: (petSitter: PetSitterDetail) => void;
}

export function EmblaCarousel({
  selectedMarker,
  handleSelectPetSitter,
}: Readonly<EmblaCarouselProps>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });
  const { petSitters } = usePetSitterSearch();
  const router = useRouter();
  useEffect(() => {
    if (!emblaApi || !selectedMarker) return;

    const index = petSitters.findIndex(
      (sitter) => sitter.id === selectedMarker.id,
    );

    if (index >= 0) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, petSitters, selectedMarker]);

  const handleCardClick = (index: number, id: number) => {
    if (!emblaApi) return;


      emblaApi.scrollTo(index);
      
      const sitter = petSitters[index];
      if (!sitter) return;
      
      handleSelectPetSitter({
        id: sitter.id,
        position: [sitter.latitude, sitter.longitude],
        selected: true,
      });

  };

  const handleDoubleClick = (id: number) => {
    router.push(`/petsitter/${id}`);
  };

  return (
    <div className="embla">
      {/* viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        {/* container */}
        <div className="flex flex-row touch-pan-y touch-pinch-zoom ml-1 sm:ml-3">
          {/* slide */}
          {petSitters.map((sitter, index) => {
            const isSelected = selectedMarker?.id === sitter.id;

            return (
              <article
                key={sitter.id}
                onClick={() => handleCardClick(index,sitter.id)}
                onDoubleClick={() => handleDoubleClick(sitter.id)}
                className={`flex-none flex flex-col gap-2 w-[330px] sm:w-[471px] min-w-0  h-[148px] sm:h-[138px] bg-white ml-1 sm:ml-3 rounded-2xl items-center py-[15px] px-[12px] hover:border-orange-500 hover:border-2 hover:border-solid ${
                  isSelected ? "border-orange-600 border-2" : ""
                }`}
              >
                <div className="flex flex-row gap-4 ">
                  <PicturePlace sitter={sitter} />
                  <div className="flex flex-col justify-between items-start h-full w-[203px] sm:w-[287px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start w-full">
                      {/* Trade name and sitter name */}
                      <div className="flex flex-col sm:w-[197px] ">
                        <h4 className="w-[197px] style-headline-4 line-clamp-1 ">
                          {sitter.tradeName}
                        </h4>
                        <p className="style-body-2 line-clamp-1">
                          By {sitter.sitter.name}
                        </p>
                      </div>
                      <RatingSitter
                        starRating={sitter.rating}
                        starClassName="w-[14px] h-[14px]"
                      />
                    </div>
                    <PetTypesList
                      petTypes={sitter.petTypes}
                      containerClassName="hidden sm:flex"
                    />
                  </div>
                </div>
                <PetTypesList
                  petTypes={sitter.petTypes}
                  containerClassName="flex sm:hidden"
                />
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
