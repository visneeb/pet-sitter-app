import { ExclamationCircleIcon } from "@/assets/icons/components";

interface RejectionNoteProps {
  adminNote: string | null;
}

export function RejectionNote({ adminNote }: RejectionNoteProps) {
  if (!adminNote) return null;

  return (
    <div className="style-body-2 text-red bg-gray-200 rounded-xl p-3 flex flex-row gap-1 items-center">
      <ExclamationCircleIcon />
      Your request has not been approved: '{adminNote}'
    </div>
  );
} 
