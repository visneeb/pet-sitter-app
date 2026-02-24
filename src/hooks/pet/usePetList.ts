"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPets } from "@/services/api/petService";
import type { Pet } from "@/types/pet";

export function usePetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPets();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pets"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { pets, isLoading, error, refetch };
}
