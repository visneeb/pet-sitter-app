import cn from "@/utils/cn";
import { Star, StarIcon } from "lucide-react";

interface FilterRatingListProps {
  rating: number[];
  onRatingChange: (rating: number[]) => void;
}

export default function FilterRatingList({
  rating,
  onRatingChange,
}: FilterRatingListProps) {
  const dataRating = [5, 4, 3, 2, 1];
  const styleButton =
    "flex flex-row justify-start items-center h-10 p-2 hover:border-orange-300 hover:shadow-xl/30 border-1 border-gray-200 rounded-lg transition shadow-sm";

  const handleRatingChange = (star: number) => {
    if (rating.includes(star)) {
      // เอาออกถ้ากดซ้ำปุ่มเดิม
      onRatingChange([]);
    } else {
      // แทนที่ด้วยปุ่มใหม่ถ้ากดปุ่มอื่น
      onRatingChange([star]);
    }
  };

  const ActiveStar = (star: number) => {
    return rating.includes(star);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <p className="style-body-2 font-medium text-gray-600">Rating:</p>
      <div className="flex flex-wrap justify-start items-center gap-x-2 gap-y-2">
        {dataRating.map((star) => {
          return (
            <button
              className={cn(
                styleButton,
                ActiveStar(star) &&
                  "border-orange-500 shadow-none hover:shadow-xl/30 hover:ring-0",
              )}
              key={star}
              onClick={() => handleRatingChange(star)}
            >
              <div className="flex flex-row items-center gap-2">
                <p
                  className={cn(
                    "style-body-2 text-gray-400",
                    ActiveStar(star) && "text-orange-500 ",
                  )}
                >
                  {star}
                </p>
                <div className="flex gap-[2px]">
                  {Array.from({ length: star }).map((_, i) => (
                    <Star key={i} color="#1CCD83" fill="#1CCD83" size={20} />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
