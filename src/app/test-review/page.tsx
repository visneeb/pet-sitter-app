"use client";


import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"

export function ConfettiSideCannons() {
  const handleClick = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

    const frame = () => {
      if (Date.now() > end) return

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  return (
    <div className="relative">
      <Button onClick={handleClick}>Trigger Side Cannons</Button>
    </div>
  )
}


import { useState } from "react";
import ReviewModal from "@/components/review/ReviewModal";
import { ActionButton } from "@/components/ui/Button";

export default function TestReviewPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">

      <ActionButton
        variant="primary"
        onClick={() => setOpen(true)}
      >
        Open Review Modal
      </ActionButton>

      <ReviewModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          console.log("review data:", data);
        }}
      />

    </div>
  );
}