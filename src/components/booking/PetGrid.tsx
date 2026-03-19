"use client";

import React from "react";
import { Pet, Sitter } from "@/contexts/booking/bookingTypes";
import { isPetAcceptedBySitter } from "@/domain/booking/acceptance";
import { PetCard } from "./BasePetCard";
import { PlusCircleIcon } from "@/assets/icons/components";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          "h-[240px] w-[240px] rounded-3xl",
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
  );
}