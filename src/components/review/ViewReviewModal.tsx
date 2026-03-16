"use client";

import { X, Star } from "lucide-react";
import Image from "next/image";
import { ActionButton } from "@/components/ui/Button";

type ViewReviewModalProps = {
  open: boolean;
  onClose: () => void;
  sitterName: string;
  sitterAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  onViewSitter?: () => void;
};

export default function ViewReviewModal({
  open,
  onClose,
  sitterName,
  sitterAvatar,
  rating,
  comment,
  date,
  onViewSitter,
}: ViewReviewModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="
          w-full md:w-[90%] md:max-w-3xl
          bg-white shadow-lg
          rounded-t-3xl md:rounded-2xl
          h-[75vh] md:h-[600px]
          max-h-[75vh] md:max-h-[600px]
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* mobile drag handle */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Your Rating and Review</h2>

          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
        
        <div className="flex gap-4 items-start">
  
            {/* Avatar */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 shrink-0">
                {sitterAvatar && (
                <Image
                    src={sitterAvatar}
                    alt={sitterName}
                    fill
                    className="object-cover"
                />
                )}
            </div>

            {/* Name + Date */}
            <div className="min-w-[120px]">
                <p className="font-semibold">{sitterName}</p>
                <p className="text-sm text-gray-500">
                    {new Date(date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                    </p>
            </div>

            {/* Stars + Comment */}
            <div className="flex flex-col">
                
                {/* Stars */}
                <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                    key={i}
                    className={`h-4 w-4 ${
                        i < rating
                        ? "fill-green-500 text-green-500"
                        : "text-gray-300"
                    }`}
                    />
                ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 mt-1">{comment}</p>

            </div>

            </div>

          {/* Divider (อยู่ใกล้ content พอดี) */}
          <div className="mt-6 border-t" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-center">
          <ActionButton
            variant="secondary"
            onClick={() => onViewSitter?.()}
          >
            View Pet Sitter
          </ActionButton>
        </div>
      </div>
    </div>
  );
}