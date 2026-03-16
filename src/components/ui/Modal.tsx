import { X } from "lucide-react";
import { ActionButton } from "./Button";

interface Props {
  id: string;
  title: string;
  massage: string;
  cancelText?: string;
  confirmText?: string;
  cancelButtonType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  confirmButtonType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onCancel?: () => Promise<void>;
  onConfirm?: () => Promise<void>;
}

function Modal(props: Props) {
  const closeModal = () => {
    const dialog = document.getElementById(
      props.id,
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    dialog.close();
  };

  return (
    <dialog id={props.id} className="modal">
      <div className="modal-box w-[calc(100%-2rem)] max-w-100 bg-white rounded-2xl p-0">
        <div className="relative px-4 py-2 border-b border-gray-300 md:px-6 md:py-4">
          <span className="style-body-1 text-black">{props.title}</span>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-1 md:right-4 md:top-3"
            disabled={props.disabled}
            onClick={closeModal}
          >
            <X className="size-5.5 text-gray-300" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <p className="style-body-2 text-gray-400">{props.massage}</p>
          <div className="flex justify-between">
            <ActionButton
              variant="secondary"
              type={props.cancelButtonType || "button"}
              disabled={props.disabled}
              onClick={async () => {
                closeModal();
                if (props.onCancel) {
                  await props.onCancel();
                }
              }}
            >
              {props.cancelText ?? "Cancel"}
            </ActionButton>
            <ActionButton
              variant="primary"
              type={props.confirmButtonType ?? "button"}
              disabled={props.disabled}
              onClick={async () => {
                if (props.onConfirm) {
                  await props.onConfirm();
                }
                closeModal();
              }}
            >
              {props.confirmText || "Confirm"}
            </ActionButton>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
