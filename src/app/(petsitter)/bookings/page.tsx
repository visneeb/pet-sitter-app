"use client";
import { ActionButton } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function PetSitterBooking() {
  const router = useRouter();
  return (
    <>
      <div>
        <ActionButton
          variant="primary"
          onClick={() => router.push("/bookings/6")}
        >
          Booking Detail Mockup Button
        </ActionButton>
      </div>
    </>
  );
}
