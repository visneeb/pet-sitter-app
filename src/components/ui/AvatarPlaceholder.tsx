import { UserIcon } from "@/assets/icons/components";
import cn from "@/utils/cn";

type AvatarPlaceholderSize = "sm" | "lg";

interface AvatarPlaceholderProps {
  /** sm: 56px (ReviewCard), lg: 160px (PetSitterBookingCard) */
  size?: AvatarPlaceholderSize;
  className?: string;
}

const sizeClasses: Record<AvatarPlaceholderSize, string> = {
  sm: "w-[56px] h-[56px]",
  lg: "w-[160px] h-[160px]",
};

const iconSizeClasses: Record<AvatarPlaceholderSize, string> = {
  sm: "w-7 h-7",
  lg: "w-16 h-16 lg:w-20 lg:h-20",
};

export default function AvatarPlaceholder({
  size = "sm",
  className,
}: AvatarPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gray-200",
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      <UserIcon className={cn("text-white", iconSizeClasses[size])} />
    </div>
  );
}
