"use client";

import { useEffect, useState } from "react";
import DetailLabel from "@/components/ui/detail/DetailLabel";
import { useBookingDetail } from "@/hooks/booking/useBookingDetail";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UserRound, X } from "lucide-react";
import { BaseModal } from "../review/BaseModal";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

function ProfileModal({ open, onClose }: ProfileModalProps) {
  const params = useParams();
  const bookingId = Number(params.bookingId);
  const { booking, isLoading } = useBookingDetail(bookingId);

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
        !h-auto md:max-w-[800px] transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"} md:translate-y-0
      `}
    >
      <div className="flex justify-between items-center border-b border-gray-200 px-4 md:px-10 py-4 md:py-6 gap-2">
        <h3 className="text-xl md:text-2xl font-bold">
          {booking?.petOwnerName ?? "Your Name"}
        </h3>
        <X className="w-6 h-6 cursor-pointer shrink-0" onClick={onClose} />
      </div>

      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-6 p-4 md:p-10 overflow-y-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 md:w-60 md:h-60 bg-gray-100 rounded-full text-gray-300 overflow-hidden flex items-center justify-center shrink-0">
            {isLoading ? (
              <div className="animate-spin rounded-full w-8 h-8 border-2 border-t-orange-500" />
            ) : booking?.petOwnerProfileImg ? (
              <Image
                src={booking.petOwnerProfileImg}
                alt="Profile"
                width={240}
                height={240}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-10 h-10 md:w-28 md:h-28" />
            )}
          </div>
        </div>

        <div className="flex flex-col bg-bg-gray rounded-lg p-4 md:p-6 gap-4 md:gap-10 w-full md:w-[440px]">
          <DetailLabel
            label="Pet Owner Name"
            value={booking?.petOwnerName ?? "-"}
          />
          <DetailLabel label="Email" value={booking?.petOwnerEmail ?? "-"} />
          <DetailLabel label="Phone" value={booking?.petOwnerPhone ?? "-"} />
          <DetailLabel label="ID Number" value={booking?.bookingId ?? "-"} />
          <DetailLabel
            label="Date of Birth"
            value={booking?.petOwnerDateOfBirth ?? "-"}
          />
        </div>
      </div>
    </BaseModal>
  );
}

export default ProfileModal;
