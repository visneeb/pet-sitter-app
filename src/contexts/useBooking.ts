"use client";

import { useContext } from "react";
import { BookingContext } from "./BookingProvider";

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}