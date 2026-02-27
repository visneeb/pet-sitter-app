import { toast } from "sonner";
import { X } from "lucide-react";

const isMobile = () => window.innerWidth < 768;

type ToastVariant = "success" | "error";

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red text-white",
};

type CustomToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  extraClass?: string;
};

export const showCustomToast = ({
  title,
  description,
  variant = "success",
  extraClass = "",
}: CustomToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`
          ${variantStyles[variant]}
          p-4 px-5 
          rounded-2xl ${extraClass}
        `}
      >
        <div className="flex justify-between items-start gap-4 pb-2">
          <h3 className="style-headline-4 md:whitespace-nowrap md:pr-30">
            {title}
          </h3>
          <button onClick={() => toast.dismiss(t)}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {description && (
          <p className="style-body-2 md:whitespace-nowrap md:pr-10">
            {description}
          </p>
        )}
      </div>
    ),
    {
      position: isMobile() ? "bottom-center" : "bottom-right",
    },
  );
};
