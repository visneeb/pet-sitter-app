"use client";

import React from "react";
import { Pet } from "@/contexts/booking/bookingTypes";
import { CheckIcon } from "@/assets/icons/components";
import petTypeColorTag from "@/constants/petTag";
import cn from "@/utils/cn";

type PetType = "Dog" | "Cat" | "Bird" | "Rabbit";

function PetImageCarousel(props: { images: string[]; alt: string }) {
  const { images, alt } = props;
  const [index, setIndex] = React.useState(0);

  const safeImages = React.useMemo(
    () => images.filter(Boolean),
    [images],
  );

  React.useEffect(() => {
    setIndex(0);
  }, [safeImages.length]);

  if (safeImages.length <= 1) {
    const src = safeImages[0];
    return src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : null;
  }

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % safeImages.length);
  };

  return (
    <div className="relative h-full w-full">
      <img
        src={safeImages[index]}
        alt={alt}
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-gray-700 shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-gray-700 shadow hover:bg-white"
      >
        ›
      </button>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 rounded-full bg-black/30 px-2 py-1">
        {safeImages.map((_, i) => (
          <span
            key={i}
            className={[
              "h-1.5 w-1.5 rounded-full",
              i === index ? "bg-white" : "bg-white/50",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

/** 🔥 Base props (ใช้ร่วมกันทุก mode) */
type BaseProps = {
  pet: Pet;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
};

/** ✅ Select mode */
type SelectProps = BaseProps & {
  variant: "select";
  selected: boolean;
  onClick?: () => void;
};

/** ✅ Action mode */
type ActionProps = BaseProps & {
  variant: "action";
  onClick?: () => void;
};

/** 🔥 Union type */
type Props = SelectProps | ActionProps;

export function BasePetCard(props: Props) {
  const { pet, disabled = false, disabledReason, className } = props;

  const isSelect = props.variant === "select";

  const images = React.useMemo<string[]>(() => {
    const p = pet as any;
    const list = Array.isArray(p.imgUrls) ? p.imgUrls : [];
    const single = typeof p.imgUrl === "string" ? p.imgUrl : "";
    return list.length > 0 ? list : single ? [single] : [];
  }, [pet]);

  const badgeColor =
    petTypeColorTag[pet.type as PetType] ??
    "border-gray-300 bg-gray-50 text-gray-600";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : props.onClick}
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      className={cn(
        "relative w-full md:w-[240px] h-[240px] rounded-3xl border bg-white p-6 shadow-sm transition ",
        "flex flex-col items-center justify-center gap-3",
        isSelect && props.selected ? "border-orange-300" : "border-gray-200",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow  hover:border-orange-500",
        className,
      )}
    >
      {/* ✅ Checkbox (เฉพาะ select mode เท่านั้น) */}
      {isSelect && (
        <span
          className={cn(
            "absolute right-4 top-4 h-6 w-6 rounded-md border flex items-center justify-center",
            props.selected
              ? "border-orange-400 bg-orange-400 text-white"
              : "border-gray-200 bg-white",
          )}
        >
          {props.selected && <CheckIcon size={16} />}
        </span>
      )}

      {/* Avatar */}
      <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
        <PetImageCarousel images={images} alt={pet.name} />
      </div>

      {/* Name */}
      <p className="text-xl font-semibold text-gray-800">{pet.name}</p>

      {/* Type badge */}
      <span className={`rounded-full border px-5 py-1 text-sm ${badgeColor}`}>
        {pet.type}
      </span>
    </button>
  );
}
