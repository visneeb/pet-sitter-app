"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type PetType = "dog" | "cat" | "bird" | "rabbit";

export type BookingInfo = {
  startDate?: string;
  startTime?: string;
  durationHours?: number;
  note?: string;
};

type BookingState = {
  selectedSitterId?: string;

  // ✅ เปลี่ยนจากเลือก 1 ตัว → เลือกหลายตัว
  selectedPetIds: string[];

  // optional: ถ้าคุณยังอยากเก็บ type (กรณีเลือกหลายตัว อาจเก็บเป็น map)
  // selectedPetTypes?: Record<string, PetType>;

  info: BookingInfo;
};

type BookingContextValue = {
  state: BookingState;

  setSitter: (sitterId: string) => void;

  // ✅ set ทั้งก้อน (เหมาะกับ multi-select)
  setPets: (petIds: string[]) => void;

  // ✅ toggle ตัวเดียว (เผื่ออยากย้าย logic toggle มาไว้ใน context)
  togglePet: (petId: string) => void;

  updateInfo: (patch: Partial<BookingInfo>) => void;

  // ✅ ถ้า sitter ไม่รับ ให้ล้าง pet ทั้งหมด หรือคุณจะปรับให้ล้างเฉพาะบางตัวก็ได้
  clearPetsIfNotAccepted: (isAccepted: boolean) => void;

  reset: () => void;

  canGoStep2: boolean;
  canGoStep3: boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>({
    selectedSitterId: undefined,
    selectedPetIds: [], // ✅ เริ่มเป็น array ว่าง
    info: {},
  });

  const setSitter = (sitterId: string) => {
    setState((prev) => ({
      ...prev,
      selectedSitterId: sitterId,
    }));
  };

  // ✅ set แบบทั้ง array (ใช้ตอนกด Next จากหน้า choose pet)
  const setPets = (petIds: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedPetIds: petIds,
    }));
  };

  // ✅ toggle แบบตัวเดียว (optional helper)
  const togglePet = (petId: string) => {
    setState((prev) => {
      const exists = prev.selectedPetIds.includes(petId);
      return {
        ...prev,
        selectedPetIds: exists
          ? prev.selectedPetIds.filter((id) => id !== petId)
          : [...prev.selectedPetIds, petId],
      };
    });
  };

  const updateInfo = (patch: Partial<BookingInfo>) => {
    setState((prev) => ({
      ...prev,
      info: { ...prev.info, ...patch },
    }));
  };

  const clearPetsIfNotAccepted = (isAccepted: boolean) => {
    if (isAccepted) return;
    setState((prev) => ({
      ...prev,
      selectedPetIds: [], // ✅ ล้างทั้งหมด
    }));
  };

  const reset = () => {
    setState({
      selectedSitterId: undefined,
      selectedPetIds: [],
      info: {},
    });
  };

  // ✅ guard: ไป step2 ได้เมื่อมี sitter และเลือก pet อย่างน้อย 1 ตัว
  const canGoStep2 = Boolean(state.selectedSitterId && state.selectedPetIds.length > 0);

  const canGoStep3 = Boolean(
    canGoStep2 &&
      state.info.startDate &&
      state.info.startTime &&
      state.info.durationHours
  );

  const value = useMemo<BookingContextValue>(
    () => ({
      state,
      setSitter,
      setPets,
      togglePet,
      updateInfo,
      clearPetsIfNotAccepted,
      reset,
      canGoStep2,
      canGoStep3,
    }),
    [state, canGoStep2, canGoStep3]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}