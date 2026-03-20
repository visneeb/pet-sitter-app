"use client";

import React from "react";
import { Pet } from "@/contexts/booking/bookingTypes";
import { CheckIcon } from "@/assets/icons/components";
import petTypeColorTag from "@/constants/petTag";
import cn from "@/utils/cn";

type PetType = "Dog" | "Cat" | "Bird" | "Rabbit";

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
        "relative w-[240px] h-[240px] rounded-3xl border bg-white p-6 shadow-sm transition ",
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
        {"imgUrl" in pet && (pet as any).imgUrl ? (
          <img
            src={(pet as any).imgUrl}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : null}
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
