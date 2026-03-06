"use client";

import { usePetList } from "@/hooks/pet/usePetList";
import { PetCard } from "@/components/pet/PetCard";

export default function PetListPage() {
  const { pets, isLoading, error } = usePetList();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex min-w-[180px] shrink-0 flex-col items-center gap-5 rounded-2xl bg-white px-10 py-8 shadow-md animate-pulse"
          >
            <div className="size-32 rounded-full bg-gray-200 lg:size-36" />
            <div className="h-6 w-20 rounded bg-gray-200" />
            <div className="h-7 w-14 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
