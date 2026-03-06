import { useState, useEffect } from "react";
import { sitterApi } from "@/services/api/sitterApi";
import { toSitter } from "@/utils/sitter";
import type { Sitter } from "@/types/sitter";
import type { SitterApi } from "@/types/sitter";

export function usePetSitterDetail(
  sitterId: number | string | null | undefined
) {
  const [sitter, setSitter] = useState<Sitter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sitterId == null || sitterId === undefined) {
      setIsLoading(false);
      return;
    }
    const id =
      typeof sitterId === "string" ? parseInt(sitterId, 10) : sitterId;
    if (Number.isNaN(id)) {
      setIsLoading(false);
      return;
    }

    sitterApi
      .getById(id)
      .then((data) => setSitter(toSitter(data as SitterApi)))
      .catch((err) => {
        setError(err.message ?? "Failed to fetch");
        setSitter(null);
      })
      .finally(() => setIsLoading(false));
  }, [sitterId]);

  return { sitter, isLoading, error };
}
