"use client";

import React from "react";

import { PetGrid } from "@/components/booking/PetGrid";
import { ActionButton } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Pet } from "@/contexts/booking/bookingTypes";
import { BookingStepFooterMobile } from "./BookingStepFooterMobile";


type Props = {
  pets: Pet[];
  sitter: {
    id: string;
    name: string;
    acceptedTypes: string[];
  };
  selectedPetIds: string[];
  loadingPets: boolean;
  petsError: string;
  totalPages: number;
  currentPage: number;
  isLastPage: boolean;
  showCreateNewPet: boolean;
  canNext: boolean;
  onTogglePet: (petId: string) => void;
  onCreateNewPet: () => void;
  onRetry: () => void | Promise<void>;
  onBack: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
};

export function BookingPetStep({
  pets,
  sitter,
  selectedPetIds,
  loadingPets,
  petsError,
  totalPages,
  currentPage,
  showCreateNewPet,
  isLastPage,
  canNext,
  onTogglePet,
  onCreateNewPet,
  onRetry,
  onBack,
  onNext,
  onPageChange,
}: Props) {
  const [showFooter, setShowFooter] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      const isBottom = scrollTop + windowHeight >= fullHeight - 10;

      setShowFooter(isBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Choose Your Pet</h1>

      <div className="mt-6 flex-1 flex justify-center lg:pb-14">
        {loadingPets ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading pets...
          </div>
        ) : petsError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <p className="text-sm text-red-500">{petsError}</p>
            <ActionButton variant="secondary" onClick={onRetry}>
              Retry
            </ActionButton>
          </div>
        ) : (
          <PetGrid
            
            pets={pets}
            sitter={sitter as any}
            selectedPetIds={selectedPetIds}
            onTogglePet={onTogglePet}
            onCreateNewPet={onCreateNewPet}
            showCreateCard={showCreateNewPet}
          />
        )}
      </div>

      <div className="md:flex items-center justify-between gap-3 hidden">
        <div className="w-[120px] ">
          <ActionButton variant="secondary" onClick={onBack}>
            Back
          </ActionButton>
        </div>

        <div className="flex-1 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />  
        </div>

        <div className="w-[120px] ">
          <ActionButton variant="primary" disabled={!canNext} onClick={onNext}>
            Next
          </ActionButton>
        </div>
      </div>
    <div>
      
    </div>
      <div className="show">
      {showFooter&&(
        <BookingStepFooterMobile
          canNext={canNext}
          onBack={onBack}
          onNext={onNext}
        />

      )}

      </div>
    </>
  );
}

