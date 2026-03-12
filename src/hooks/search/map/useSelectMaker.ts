import { useState } from "react";

interface PetSitterDetail {
  id: number;
  position: [number, number];
  selected: boolean;
}

export type { PetSitterDetail };

export default function useSelectMaker() {
  const [selectPetSitter, setSelectPetSitter] =
    useState<PetSitterDetail | null>(null);

  const handleSelectPetSitter = (petSitter: PetSitterDetail) => {
    setSelectPetSitter(petSitter);
  };

  return {
    selectedMarker: selectPetSitter,
    handleSelectPetSitter,
  };
}