import { petApi, PetDetail } from "@/services/api/pet";
import { useState, useEffect, useCallback } from "react";

export function usePetList() {
  const [pets, setPets] = useState<PetDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await petApi.getMyPets();
      setPets(data);
    } catch {
      setError("Could not load pets.");
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return { pets, loading, error, refetch: fetchPets };
}
