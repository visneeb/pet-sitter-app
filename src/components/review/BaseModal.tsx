"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import cn from "@/utils/cn";

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
};

export function BaseModal({
  open,
  onClose,
  children,
  className,
  closeOnOverlayClick = true,
}: BaseModalProps) {
  // 🔒 ESC + scroll lock
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40">
      {/* overlay */}
      {closeOnOverlayClick && (
        <div className="absolute inset-0" onClick={onClose} />
      )}

      {/* modal content */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center sm:items-center sm:inset-0 sm:px-4 sm:py-10">
        <div
          className={cn(
            "relative z-10 flex w-full flex-col overflow-hidden bg-white shadow-xl",
            "max-h-[70vh]  rounded-t-xl",
            "sm:max-h-[calc(100vh-8rem)] h-full sm:max-w-[820px] sm:rounded-xl",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}