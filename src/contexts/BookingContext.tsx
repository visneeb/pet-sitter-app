"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "booking-context";

export type BookingInfo = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  startDateTime?: string;
  endDateTime?: string;
  durationHours?: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export type BookingState = {
  selectedSitterId?: string;
  selectedSitterName?: string;
  selectedSitterAcceptedTypes?: string[];
  selectedPetIds: string[];
  info: BookingInfo;
};

type BookingContextValue = {
  state: BookingState;
  setSitter: (
    sitterId: string,
    sitterName?: string,
    acceptedTypes?: string[]
  ) => void;
  setPets: (petIds: string[]) => void;
  togglePet: (petId: string) => void;
  updateInfo: (patch: Partial<BookingInfo>) => void;
  clearPetsIfNotAccepted: (isAccepted: boolean) => void;
  reset: () => void;
  canGoStep2: boolean;
  canGoStep3: boolean;
};

const initialState: BookingState = {
  selectedSitterId: undefined,
  selectedSitterName: undefined,
  selectedSitterAcceptedTypes: [],
  selectedPetIds: [],
  info: {},
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<BookingState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // โหลดข้อมูลจาก sessionStorage ตอนเปิดหน้า/refresh
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as BookingState;
        setState(parsed);
      }
    } catch (error) {
      console.error("Failed to load booking context from sessionStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // บันทึก state ลง sessionStorage ทุกครั้งที่เปลี่ยน
  useEffect(() => {
    if (!isHydrated) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save booking context to sessionStorage:", error);
    }
  }, [state, isHydrated]);

  const setSitter = (
    sitterId: string,
    sitterName?: string,
    acceptedTypes?: string[]
  ) => {
    setState((prev) => ({
      ...prev,
      selectedSitterId: sitterId,
      selectedSitterName: sitterName,
      selectedSitterAcceptedTypes: acceptedTypes ?? [],
    }));
  };

  const setPets = (petIds: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedPetIds: petIds,
    }));
  };

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

  // const updateInfo = (patch: Partial<BookingInfo>) => {
  //   setState((prev) => ({
  //     ...prev,
  //     info: {
  //       ...prev.info,
  //       ...patch,
  //     },
  //   }));
  // };

  const updateInfo = (
    patch: Partial<BookingInfo> | ((prev: BookingInfo) => Partial<BookingInfo>)
  ) => {
    setState((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        ...(typeof patch === "function" ? patch(prev.info) : patch),
      },
    }));
  };

  const clearPetsIfNotAccepted = (isAccepted: boolean) => {
    if (isAccepted) return;

    setState((prev) => ({
      ...prev,
      selectedPetIds: [],
    }));
  };

  const reset = () => {
    setState(initialState);

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear booking context from sessionStorage:", error);
    }
  };

  const canGoStep2 = Boolean(
    state.selectedSitterId && state.selectedPetIds.length > 0
  );

  const canGoStep3 = Boolean(
    canGoStep2 &&
      state.info.startDate &&
      state.info.endDate &&
      state.info.startTime &&
      state.info.endTime &&
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

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);

  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }

  return ctx;
}