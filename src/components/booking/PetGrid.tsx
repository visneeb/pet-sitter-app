"use client";

import React from "react";
import { Pet, Sitter } from "@/context/booking/bookingTypes";
import { isPetAcceptedBySitter } from "@/domain/booking/acceptance";
import { PetCard } from "./PetCard";

type Props = {
  pets: Pet[];
  sitter?: Sitter;

  // ✅ เปลี่ยนจาก selectedPetId เป็น array
  selectedPetIds: string[];
  onTogglePet: (petId: string) => void;

  // ✅ create new pet card
  onCreateNewPet?: () => void;
  showCreateCard?: boolean;
};

export function PetGrid({
  pets,
  sitter,
  selectedPetIds,
  onTogglePet,
  onCreateNewPet,
  showCreateCard = true
}: Props) {
  return (
    <div className="grid grid-cols-[240px_240px_240px] gap-6">
      {/* 1) render pet cards ตามข้อมูล */}
      {pets.map((pet) => {
        const { accepted, reason } = isPetAcceptedBySitter(pet, sitter);

        return (
          <PetCard
            key={pet.id}
            pet={pet}
            selected={selectedPetIds.includes(pet.id)}
            disabled={!accepted}
            disabledReason={reason}
            onSelect={() => onTogglePet(pet.id)}
          />
        );
      })}

      {/* 2) +1 create new pet card (สีต่าง) */}
      {showCreateCard && (
      <button
        type="button"
        onClick={onCreateNewPet}
        className={[
          "h-[240px] w-[240px] rounded-3xl",
          "bg-orange-50 text-orange-600",
          "flex flex-col items-center justify-center gap-4",
          "hover:bg-orange-100 transition",
        ].join(" ")}
      >
        <div className="h-14 w-14 rounded-full border-2 border-orange-400 flex items-center justify-center text-3xl">
          +
        </div>
        <div className="text-sm font-semibold">Create New Pet</div>
      </button>
      )}
    </div>
  );
}