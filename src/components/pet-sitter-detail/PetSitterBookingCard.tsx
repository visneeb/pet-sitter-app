"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AvatarPlaceholder from "@/components/ui/AvatarPlaceholder";
import { Star } from "lucide-react";
import { MapMarkerIcon } from "@/assets/icons/components";
import TagPetType from "@/components/search/PetSitterCard/TagPetType";
import { ActionButton } from "@/components/ui/Button";
import { BookingModal, type BookingFormValues } from "./BookingModal";
import { useAuth } from "@/contexts/AuthContext";
import type { Sitter } from "@/types/sitter";
import { chatApi } from "@/services/api/chat";
import { useBooking } from "@/contexts/BookingContext";

/* รวม date + time ให้เป็น Date object จริง */
function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/* คำนวณจำนวนชั่วโมงจากเวลาเริ่มและเวลาจบ */
function calculateDurationHours(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

interface PetSitterBookingCardProps {
  sitter: Pick<
    Sitter,
    | "tradeName"
    | "sitter"
    | "experience"
    | "rating"
    | "district"
    | "province"
    | "petTypes"
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
  const { setSitter, updateInfo, reset } = useBooking();

  const canBook = user?.role === "owner";

  const [isBooking, setIsBooking] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const hasOpenedFromRedirect = useRef(false);
  const [avatarError, setAvatarError] = useState(false);

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

  const handleMessage = async () => {
    if (!user) {
      const returnUrl = sitterId ? `/petsitter/${sitterId}` : "/chat";
      router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }
    if (!sitterId) {
      router.push("/chat");
      return;
    }

    const sitterIdNumber = Number(sitterId);
    if (!Number.isInteger(sitterIdNumber) || sitterIdNumber <= 0) {
      router.push("/chat");
      return;
    }

    try {
      setIsStartingChat(true);
      const conversation =
        await chatApi.findOrCreateConversation(sitterIdNumber);
      router.push(`/chat/${conversation.conversationId}`);
    } catch (error) {
      console.error("Failed to open chat conversation:", error);
      router.push("/chat");
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleBookingConfirm = (data: BookingFormValues) => {
    if (!sitterId || !data.startDate || !data.endDate) return;

    const startDateTime = combineDateAndTime(data.startDate, data.startTime);
    const endDateTime = combineDateAndTime(data.endDate, data.endTime);
    const durationHours = calculateDurationHours(startDateTime, endDateTime);

    if (durationHours <= 0) return;

    const formatDateOnly = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    reset();

    setSitter(sitterId, sitter.tradeName ?? "—", sitter.petTypes ?? []);

    updateInfo({
      startDate: formatDateOnly(data.startDate),
      endDate: formatDateOnly(data.endDate),
      startTime: data.startTime,
      endTime: data.endTime,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      durationHours,
    });

    setIsBooking(false);
    router.push("/booking");
  };

  return (
    <>
      <div className="sticky top-25 flex min-h-[562px] w-full flex-col items-center gap-6 bg-white pt-10 text-center shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)] lg:w-[416px] lg:rounded-2xl">
        <div className="flex w-full flex-col items-center gap-6 px-6">
          <div className="shrink-0 overflow-hidden rounded-full">
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={sitter.tradeName ?? "Pet sitter"}
                className="h-[160px] w-[160px] object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <AvatarPlaceholder size="lg" />
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="style-headline-3 lg:style-headline-2">
              {sitter.tradeName ?? "—"}
            </h2>

            <h4 className="style-body-1 lg:style-headline-4">
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

            <div className="flex items-center lg:gap-2">
              <MapMarkerIcon color="#AEB1C3" size={20} />
              <p className="style-body-3 lg:style-body-2 text-gray-500">
                {location}
              </p>
            </div>

            <TagPetType sitter={{ petTypes: sitter.petTypes ?? [] }} />
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-200 w-full py-6 px-6">
          <ActionButton
            variant="secondary"
            onClick={handleMessage}
            className="w-full disabled:text-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed hidden md:block"
            disabled={user ? !canBook || isStartingChat : false}
          >
            Message
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleBookNow}
            className="w-full disabled:cursor-not-allowed"
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
