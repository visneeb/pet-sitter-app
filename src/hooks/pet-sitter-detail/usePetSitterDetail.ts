import { useState, useEffect } from "react";
import { getPublicPetSitterById } from "@/services/api/sitterApi";
import { toSitter } from "@/utils/sitter";
import type { Sitter } from "@/types/sitter";

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

    setError(null);
    setIsLoading(true);

    getPublicPetSitterById(id.toString())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setSitter(null);
        } else if (response.data) {
          setSitter(toSitter(response.data));
          setError(null);
        }
      })
      .catch((err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as Error).message
            : "Failed to fetch";
        setError(message);
        setSitter(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sitterId]);

  return { sitter, isLoading, error };
}
