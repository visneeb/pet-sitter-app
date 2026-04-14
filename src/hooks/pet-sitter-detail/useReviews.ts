import { useState, useEffect } from "react";
import { getSitterReviewsById } from "@/services/api/sitter";
import type { ReviewApi } from "@/services/api/sitter";

export interface UseReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export function useReviews(
  sitterId: string | null | undefined,
  params: UseReviewsParams = {},
) {
  const [reviews, setReviews] = useState<ReviewApi[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 5, rating } = params;

  useEffect(() => {
    if (sitterId == null || sitterId === undefined || sitterId === "") {
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    getSitterReviewsById(sitterId, { page, limit, rating })
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setReviews([]);
        } else if (response.data) {
          setReviews(response.data.reviews);
          setTotalPages(response.data.totalPages);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as Error).message
            : "Failed to fetch reviews";
        setError(message);
        setReviews([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sitterId, page, limit, rating]);

  return { reviews, totalPages, isLoading, error };
}
