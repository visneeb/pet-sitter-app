"use client";

import { createPortal } from "react-dom";
import { CloseIcon, PhoneAltIcon } from "@/assets/icons/components";
import { ActionButton } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  petSitterName: string;
  phoneNumber: string;
  onClose: () => void;
}

function PhoneNumberModal({
  isOpen,
  petSitterName,
  phoneNumber,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal box */}
      <div className="relative w-[calc(100%-2rem)] max-w-100 bg-white rounded-2xl p-0 z-10">
        <div className="flex flex-row justify-between px-4 py-2 border-b border-gray-300 md:px-6 md:py-4">
          <span className="style-body-1 text-black">Contact Pet Sitter</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 transition hover:text-gray-400 hover:cursor-pointer"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <p className="style-body-1 text-gray-400">{petSitterName}</p>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
            <PhoneAltIcon className="size-5 text-orange-500 shrink-0" />
            <span className="style-body-1 text-black">{phoneNumber}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default PhoneNumberModal;
