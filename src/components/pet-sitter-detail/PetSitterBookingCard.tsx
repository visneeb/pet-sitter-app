"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_PLACEHOLDER } from "@/constants/placeholders";
import { Star } from "lucide-react";
import { MapMarkerIcon } from "@/assets/icons/components";
import TagPetType from "@/components/search/PetSitterCard/TagPetType";
import { ActionButton, NavigationButton } from "@/components/ui/Button";
import { BookingModal, type BookingFormValues } from "./BookingModal";
import { useAuth } from "@/contexts/AuthContext";
import type { Sitter } from "@/types/sitter";

interface PetSitterBookingCardProps {
  sitter: Pick<
    Sitter,
    "tradeName" | "sitter" | "experience" | "rating" | "district" | "province" | "petTypes"
  >;
  sitterId?: string;
  initialOpenBooking?: boolean;
}

export default function PetSitterBookingCard({
  sitter,
  sitterId,
  initialOpenBooking,
}: PetSitterBookingCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  // ✅ เฉพาะ owner เท่านั้นที่ book ได้; sitter และ admin ไม่สามารถกด Book now ได้
  const canBook = user?.role === "owner";
  const [isBooking, setIsBooking] = useState(false);
  const hasOpenedFromRedirect = useRef(false);
  const [avatarError, setAvatarError] = useState(false);

  // เปิด modal เมื่อ redirect กลับมาหน้า petsitter พร้อม openBooking=1 และ user เป็น owner
  useEffect(() => {
    if (
      initialOpenBooking &&
      user?.role === "owner" &&
      !hasOpenedFromRedirect.current
    ) {
      hasOpenedFromRedirect.current = true;
      setIsBooking(true);
    }
  }, [initialOpenBooking, user?.role]);
  const sitterName = sitter.sitter?.name ?? "—";
  const avatarUrl = sitter.sitter?.profileImgUrl ?? undefined;
  const experience = `${sitter.experience ?? 0} Years Exp.`;
  const rating = sitter.rating ?? 5;
  const location = `${sitter.district ?? "—"}, ${sitter.province ?? "—"}`;

  const handleBookNow = () => {
    if (!user) {
      if (sitterId) {
        const returnUrl = `/petsitter/${sitterId}?openBooking=1`;
        router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
      } else {
        router.push("/auth/login");
      }
      return;
    }
    if (!canBook) return;
    setIsBooking(true);
  };

  const handleBookingConfirm = (data: BookingFormValues) => {
    console.log("Booking data:", data);
  };

  return (
    <>
    <div className="sticky top-4 flex flex-col w-full md:w-[416px] min-h-[562px] gap-6 px-6 py-10 items-center text-center bg-white md:rounded-2xl shadow-sm">
      <div className="bg-gray-100 rounded-full w-[160px] h-[160px] shrink-0 overflow-hidden">
        <img
          src={avatarUrl && !avatarError ? avatarUrl : AVATAR_PLACEHOLDER}
          alt={sitter.tradeName ?? "Pet sitter"}
          className="w-full h-full object-cover"
          onError={() => setAvatarError(true)}
        />
      </div>
      <div className="flex flex-col gap-4 w-full items-center">
        <h2 className="style-headline-3 md:style-headline-2">{sitter.tradeName ?? "—"}</h2>
        <h4 className="style-body-1 md:style-headline-4">
          {sitterName}{" "}
          <span className="style-body-2 text-green-500">{experience}</span>
        </h4>
        <div className="flex gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              color="#1CCD83"
              fill={i < rating ? "#1CCD83" : "none"}
              size={20}
            />
          ))}
        </div>
        <div className="flex items-center md:gap-2">
        <MapMarkerIcon color="#AEB1C3" size={20} />
          <p className="style-body-3 md:style-body-2 text-gray-500">{location}</p>
        </div>
        <TagPetType sitter={{ petTypes: sitter.petTypes ?? [] }} />
      </div>
      <div className="flex gap-4 border-t border-gray-200 w-full pt-4">
        <NavigationButton variant="secondary" href="/messages" className="w-full hidden md:block">
          Message
        </NavigationButton>
        <ActionButton
          variant="primary"
          onClick={handleBookNow}
          className="w-full"
          disabled={user ? !canBook : false}
        >
          Book now
        </ActionButton>
      </div>
    </div>

    {isBooking && (
      <BookingModal
        sitter={sitter}
        onClose={() => setIsBooking(false)}
        onConfirm={handleBookingConfirm}
      />
    )}
    </>
  );
}
