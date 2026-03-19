import { useState } from "react";
import { adminApi } from "@/services/api/admin";

interface RejectFormValues {
  adminNote: string;
}

interface UseRejectSitterProps {
  sitterId: number;
  hasPendingUpdate: boolean;
  onSuccess?: () => void;
}

export function useRejectSitter({
  sitterId,
  hasPendingUpdate,
  onSuccess,
}: UseRejectSitterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const reject = async ({ adminNote }: RejectFormValues) => {
    setIsLoading(true);

    try {
      if (hasPendingUpdate) {
        await adminApi.rejectUpdateSitter(sitterId, { adminNote });
      } else {
        await adminApi.adminReviewSitter(sitterId, {
          status: "Rejected",
          adminNote,
        });
      }
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  return { reject, isLoading };
}
