"use client";

import DetailLabel from "@/components/ui/detail/DetailLabel";
import { BookingDetail } from "@/types/booking";
import { X } from "lucide-react";
import { PawPrint } from "lucide-react";

type Pet = BookingDetail["pets"][number];

interface PetModalProps {
  pet: Pet;
  onClose: () => void;
}

function PetModal({ pet, onClose }: PetModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white max-w-[800px] w-full rounded-2xl">
        <div className="flex justify-between items-center border-b border-gray-200 px-[40px] py-[24px] gap-[10px]">
          <h3 className="text-2xl font-bold">{pet.petName}</h3>
          <X className="w-[24px] h-[24px] cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex gap-[40px] p-[40px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-center w-[240px] h-[240px] bg-gray-100 rounded-full text-gray-300 overflow-hidden">
              {pet.imgUrl ? (
                <img
                  src={pet.imgUrl}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PawPrint className="w-[120px] h-[120px]" />
              )}
            </div>
            <div className="flex justify-center">
              <h4>{pet.petName}</h4>
            </div>
          </div>
          <div className="grid grid-cols-2 bg-bg-gray rounded-lg p-[24px] gap-[40px] w-[440px]">
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
      </div>
    </div>
  );
}

export default PetModal;
