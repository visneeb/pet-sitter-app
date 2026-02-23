import cn from "@/utils/cn";
import IconStar from "../ui/IconStar";

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
    "flex flex-row justify-start items-center h-10 p-2 hover:ring-4 hover:ring-green-200 hover:shadow-xl/30 border-1 border-gray-200 rounded-lg transition shadow-sm";

  const handleRatingChange = (star: number) => {
    if (rating.includes(star)) {
      onRatingChange(rating.filter((r) => r !== star));
    } else {
      onRatingChange([...rating, star]);
    }
  };

  const ActiveStar = (star: number) => {
    return rating.includes(star);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <p className="style-body-2 font-medium">Rating:</p>
      <div className="flex flex-wrap justify-start items-center gap-x-5 gap-y-2">
        {dataRating.map((star) => {
          return (
            <button
              className={cn(styleButton, ActiveStar(star) && "bg-green-100 shadow-none hover:shadow-xl/30 hover:ring-0")}
              key={star}
              onClick={() => handleRatingChange(star)}
            >
              <div className="flex flex-row items-center gap-2">
                <p className="style-body-2 text-gray-400">{star}</p>
                <div className="flex gap-1">
                  {Array.from({ length: star }).map((_, i) => (
                    <IconStar key={i} filled={i < star} />
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
