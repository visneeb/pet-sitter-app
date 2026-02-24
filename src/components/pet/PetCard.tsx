"use client";

import Link from "next/link";
import type { Pet } from "@/types/pet";
import cn from "@/utils/cn";

interface PetCardProps {
  pet: Pet;
}

const speciesStyles: Record<Pet["species"], string> = {
  Dog: "bg-green-100 text-green-500 border",
  Cat: "bg-pink-100 text-pink-500 border",
  Bird: "bg-blue-100 text-blue-500 border",
};

export function PetCard({ pet }: PetCardProps) {
  const tagStyle = speciesStyles[pet.species] ?? "bg-gray-500 text-white";

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="flex min-w-[180px] shrink-0 flex-col items-center gap-5 rounded-2xl bg-white px-10 py-8 shadow-md transition hover:shadow-lg"
    >
      <div className="size-32 overflow-hidden rounded-full bg-gray-200 lg:size-36">
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-5xl text-gray-400">
            {pet.species === "Dog" ? "🐕" : pet.species === "Cat" ? "🐈" : "🐦"}
          </div>
        )}
      </div>
      <span className="text-center style-headline-4 text-gray-600">
        {pet.name}
      </span>
      <span
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium",
          tagStyle
        )}
      >
        {pet.species}
      </span>
    </Link>
  );
}
