"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { MapMarkerIcon } from "@/assets/icons/components";
import TagPetType from "@/components/search/PetSitterCard/TagPetType";
import { ActionButton, NavigationButton } from "@/components/ui/Button";
import { BookingModal, type BookingFormValues } from "./BookingModal";
import type { Sitter } from "@/types/sitter";

interface PetSitterBookingCardProps {
  sitter: Pick<
    Sitter,
    "tradeName" | "sitter" | "experience" | "rating" | "address" | "petTypes"
  >;
}

export default function PetSitterBookingCard({
  sitter,
}: PetSitterBookingCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const sitterName = sitter.sitter?.name ?? "—";
  const avatarUrl = sitter.sitter?.profileImgUrl ?? undefined;
  const experience = `${sitter.experience ?? 0} Years Exp.`;
  const rating = sitter.rating ?? 5;
  const location = sitter.address ?? "—";

  const handleBookNow = () => setIsBooking(true);

  const handleBookingConfirm = (data: BookingFormValues) => {
    // TODO: integrate with booking API
    console.log("Booking data:", data);
  };

  return (
    <>
    <div className="sticky top-4 flex flex-col w-full md:w-[416px] min-h-[562px] gap-6 px-6 py-10 items-center text-center bg-white rounded-2xl shadow-sm">
      <div
        className="bg-gray-100 rounded-full w-[160px] h-[160px] shrink-0 overflow-hidden"
        style={
          avatarUrl
            ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover" }
            : undefined
        }
      />
      <div className="flex flex-col gap-4 w-full items-center">
        <h2 className="style-headline-2">{sitter.tradeName ?? "—"}</h2>
        <h4 className="style-headline-4">
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
        <div className="flex items-center gap-2">
          <MapMarkerIcon color="#AEB1C3" size={20} />
          <p className="style-body-2 text-gray-500">{location}</p>
        </div>
        <TagPetType sitter={{ petTypes: sitter.petTypes ?? [] }} />
      </div>
      <div className="flex gap-4 border-t border-gray-200 w-full pt-4">
        <NavigationButton variant="secondary" href="/messages" className="w-full">
          Message
        </NavigationButton>
        <ActionButton variant="primary" onClick={handleBookNow} className="w-full">
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
