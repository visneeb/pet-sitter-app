"use client";

import { usePetList } from "@/hooks/pet/usePetList";
import { BasePetCard } from "@/components/booking/BasePetCard";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

export function PetList() {
  const { pets, loading, error } = usePetList();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pageSize = isMobile ? 4 : 8;
  const totalPages = Math.max(1, Math.ceil(pets.length / pageSize));

  // Reset to page 1 when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const pagedPets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return pets.slice(start, start + pageSize);
  }, [pets, currentPage, pageSize]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col grid-cols-[repeat(auto-fit,240px)]  gap-4 sm:grid">
        {pagedPets.map((pet) => (
          <BasePetCard
            key={pet.id}
            variant="action"
            className="w-full"
            pet={{
              id: String(pet.id),
              name: pet.petName,
              type: pet.petType,
              imgUrl: pet.imgUrl,
            }}
            onClick={() => router.push(`/pets/${pet.id}`)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
