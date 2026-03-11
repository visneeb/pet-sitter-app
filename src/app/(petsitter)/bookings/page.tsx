"use client";
import { ActionButton } from "@/components/ui/Button";
import BookingDetail from "@/components/booking/BookingDetail";
import { useState } from "react";

export default function PetSitterBooking() {
  const [view, setView] = useState("list");
  return (
    <>
      <div>
        <ActionButton
          variant="primary"
          onClick={() => setView(view === "detail" ? "list" : "detail")}
        >
          Booking Detail Mockup Button
        </ActionButton>
        {view === "detail" && <BookingDetail />}
      </div>
    </>
  );
}
