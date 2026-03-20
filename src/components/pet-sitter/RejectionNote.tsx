import { ExclamationCircleIcon } from "@/assets/icons/components";
import { ActionButton } from "../ui/Button";

interface RejectionNoteProps {
  adminNote: string | null;
  handleHideReview?: () => Promise<void>;
}

export function RejectionNote({
  adminNote,
  handleHideReview,
}: RejectionNoteProps) {
  if (!adminNote) return null;

  return (
    <div className="flex justify-between items-center style-body-2 text-red bg-gray-200 rounded-xl p-3">
      <div className="flex flex-row gap-2 items-center">
        <ExclamationCircleIcon />
        Your request has not been approved: '{adminNote}'
      </div>
      {handleHideReview && (
        <ActionButton variant="ghost" type="button" onClick={handleHideReview}>
          Hide
        </ActionButton>
      )}
    </div>
  );
}
