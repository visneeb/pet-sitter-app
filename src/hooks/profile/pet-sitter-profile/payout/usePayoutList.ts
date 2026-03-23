"use client";
import { useState, useEffect } from "react";
import { paymentApi, PayoutSummary } from "@/services/api/paymentApi";
import { getCurrentSitter } from "@/services/api";

interface UsePayoutListReturn {
  data: PayoutSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePayoutList = (): UsePayoutListReturn => {
  const [data, setData] = useState<PayoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayoutList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: sitter, error: sitterError } = await getCurrentSitter();
      if (sitterError || !sitter?.id) {
        setError(sitterError ?? "Failed to get sitter profile");
        return;
      }

      const response = await paymentApi.getPayoutSummary(Number(sitter.id));
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch payout list",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutList();
  }, []);

  return { data, isLoading, error, refetch: fetchPayoutList };
};
