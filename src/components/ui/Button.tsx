import Link from "next/link";
import cn from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

interface ActionButtonProps {
  variant: ButtonVariant;
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

interface NavigationButtonProps {
  variant: ButtonVariant;
  children: React.ReactNode;
  href: `/${string}`;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "flex justify-center items-center gap-2 min-w-30 px-6 py-3 style-button text-white bg-orange-500 rounded-full transition-colors duration-200 cursor-pointer",
    "hover:bg-orange-400",
    "active:bg-orange-600",
    "disabled:text-gray-300 disabled:bg-gray-200",
  ),
  secondary: cn(
    "flex justify-center items-center gap-2 min-w-30 px-6 py-3 style-button text-orange-500 bg-orange-100 rounded-full transition-colors duration-200 cursor-pointer",
    "hover:text-orange-400",
    "active:text-orange-600",
    "disabled:text-gray-200 disabled:bg-gray-100",
  ),
  ghost: cn(
    "flex justify-center items-center gap-1 px-0.5 py-1 style-button text-orange-500 transition-colors duration-200 cursor-pointer",
    "hover:text-orange-400",
    "active:text-orange-600",
    "disabled:text-gray-200",
  ),
  icon: cn(
    "flex justify-center items-center gap-2 p-4.5 text-orange-500 bg-orange-100 rounded-full transition-colors duration-200 cursor-pointer",
    "hover:text-orange-400",
    "active:text-orange-600",
    "disabled:text-gray-200 disabled:bg-gray-100",
  ),
};

export function ActionButton(props: ActionButtonProps) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className={cn(variants[props.variant], props.className, "")}
    >
      {props.children}
    </button>
  );
}

export function NavigationButton(props: NavigationButtonProps) {
  return (
    <Link
      href={props.href}
      className={cn(variants[props.variant], props.className)}
    >
      {props.children}
    </Link>
  );
}
