"use client";

import DetailLabel from "@/components/ui/detail/DetailLabel";
import { BookingDetail } from "@/types/booking";
import { X, PawPrint } from "lucide-react";
import { BaseModal } from "../review/BaseModal";
import { useEffect, useState } from "react";

type Pet = BookingDetail["pets"][number];

interface PetModalProps {
  pet: Pet;
  open: boolean;
  onClose: () => void;
}

function PetModal({ pet, open, onClose }: PetModalProps) {
  const [renderOpen, setRenderOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Step 1: When open changes, control renderOpen
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setRenderOpen(true));
    } else {
      requestAnimationFrame(() => setVisible(false));
      const timeout = setTimeout(() => setRenderOpen(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Step 2: When renderOpen becomes true, wait for paint then animate
  useEffect(() => {
    if (renderOpen && open) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }
  }, [renderOpen, open]);

  return (
    <BaseModal
      open={renderOpen}
      onClose={onClose}
      className={`
        md:max-w-[800px] transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"} md:translate-y-0
      `}
    >
      <div className="flex justify-between items-center border-b border-gray-200 px-4 md:px-10 py-4 md:py-6 gap-2">
        <h3 className="text-xl md:text-2xl font-bold">{pet.petName}</h3>
        <X className="w-6 h-6 cursor-pointer shrink-0" onClick={onClose} />
      </div>

      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-6 p-4 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-col items-center gap-4">
          <div className="w-20 h-20 md:w-60 md:h-60 bg-gray-100 rounded-full text-gray-300 overflow-hidden flex items-center justify-center shrink-0">
            {pet.imgUrl ? (
              <img
                src={pet.imgUrl}
                alt={pet.petName}
                className="w-full h-full object-cover"
              />
            ) : (
              <PawPrint className="w-10 h-10 md:w-28 md:h-28" />
            )}
          </div>
          <h4 className="hidden md:block md:text-base text-2xl md:text-center font-medium">
            {pet.petName}
          </h4>
        </div>

        <div className="flex flex-col bg-bg-gray rounded-lg p-4 md:p-6 gap-[16px] md:gap-10 w-full md:w-[440px]">
          <DetailLabel label="Pet Name" value={pet.petName ?? "-"} />
          <DetailLabel label="Pet Type" value={pet.petType ?? "-"} />
          <DetailLabel label="Breed" value={pet.breed ?? "-"} />
          <DetailLabel label="Sex" value={pet.sex ?? "-"} />
          <DetailLabel label="Color" value={pet.color ?? "-"} />
          <DetailLabel label="Weight" value={pet.weight ?? "-"} />
          <DetailLabel label="Date of Birth" value={pet.dateOfBirth ?? "-"} />
          {pet.about && <DetailLabel label="About" value={pet.about} />}
        </div>
      </div>
    </BaseModal>
  );
}

export default PetModal;
