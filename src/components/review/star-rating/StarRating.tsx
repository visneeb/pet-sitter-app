import { Star } from "lucide-react";
import cn from "@/utils/cn";

type StarRatingProps = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-green-500 text-green-500"
              : "fill-none text-gray-300",
            className,
          )}
        />
      ))}
    </div>
  );
}
