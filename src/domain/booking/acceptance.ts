

import { Pet, Sitter } from "@/contexts/booking/bookingTypes";

export function isPetAcceptedBySitter(
  pet: Pet,
  sitter?: Sitter
): { accepted: boolean; reason?: string } {

  if (!sitter) {
    return { accepted: true };
  }

  if (!sitter.acceptedTypes?.length) {
    return { accepted: true };
  }

  const accepted = sitter.acceptedTypes.includes(pet.type);

  if (!accepted) {
    return {
      accepted: false,
      reason: `This sitter does not accept ${pet.type}.`,
    };
  }

  return { accepted: true };
}