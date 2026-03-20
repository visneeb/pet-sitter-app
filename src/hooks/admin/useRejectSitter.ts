import { useState } from "react";
import { adminApi } from "@/services/api/admin";

interface RejectFormValues {
  adminNote: string;
}

interface UseRejectSitterProps {
  sitterId: number;
  onSuccess?: () => void;
}

export function useRejectSitter({ sitterId, onSuccess }: UseRejectSitterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const reject = async ({ adminNote }: RejectFormValues) => {
    setIsLoading(true);

    try {
      await adminApi.rejectUpdateSitter(sitterId, { adminNote });
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  return { reject, isLoading };
}
