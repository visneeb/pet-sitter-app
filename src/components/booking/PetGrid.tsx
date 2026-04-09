"use client";

import React from "react";
import { Pet, Sitter } from "@/contexts/booking/bookingTypes";
import { isPetAcceptedBySitter } from "@/domain/booking/acceptance";
import { BasePetCard } from "./BasePetCard";
import { PlusCircleIcon } from "@/assets/icons/components";

type Props = {
  pets: Pet[];
  sitter?: Sitter;
  className?: string;

  // ✅ เปลี่ยนจาก selectedPetId เป็น array
  selectedPetIds: string[];
  onTogglePet: (petId: string) => void;

  // ✅ create new pet card
  onCreateNewPet?: () => void;
  showCreateCard?: boolean;
};

export function PetGrid({
  className,
  pets,
  sitter,
  selectedPetIds,
  onTogglePet,
  onCreateNewPet,
  showCreateCard = true
}: Props) {
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  const scrollByOneCard = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 240;
    const amount = cardWidth + 16;
    const nextLeft = direction === "left" ? el.scrollLeft - amount : el.scrollLeft + amount;

    el.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className={["relative group w-full min-w-0", className ?? ""].join(" ")}>
      <div
        ref={carouselRef}
      className={[
        "flex w-full min-w-0 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth",
        "md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0",
      ].join(" ")}
    >
      {/* 1) render pet cards ตามข้อมูล */}
      {pets.map((pet) => {
        const { accepted, reason } = isPetAcceptedBySitter(pet, sitter);

        return (
          <BasePetCard
            className={[
              "h-[240px]! w-[240px] shrink-0 snap-start md:w-full!",
            ].join(" ")}
            key={pet.id}
            pet={pet}
            selected={selectedPetIds.includes(pet.id)}
            disabled={!accepted}
            disabledReason={reason}
            onClick={() => onTogglePet(pet.id)}
            variant="select"
          />
        );
      })}

      {/* 2) +1 create new pet card (สีต่าง) */}
      {showCreateCard && (
      <button
        type="button"
        onClick={onCreateNewPet}
        className={[
          "h-[240px] w-[240px] shrink-0 snap-start rounded-3xl md:w-[240px]",
          "bg-orange-50 text-orange-500",
          "flex flex-col items-center justify-center gap-4",
          "hover:bg-orange-100 transition",
        ].join(" ")}
      >
        <div>
          <PlusCircleIcon size={50}/>
        </div>
        <div className="text-sm font-semibold">Create New Pet</div>
      </button>
      )}
    </div>

      <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Previous cards"
          onClick={() => scrollByOneCard("left")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next cards"
          onClick={() => scrollByOneCard("right")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow"
        >
          ›
        </button>
      </div>
    </div>
  );
}