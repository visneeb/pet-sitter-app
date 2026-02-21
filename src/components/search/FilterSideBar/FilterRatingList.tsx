import IconStar from "../ui/IconStar";

export default function FilterRatingList() {
  const rating = [5, 4, 3, 2, 1];
  return (
    <div className="flex flex-col gap-2 ">
      <p className="style-body-2 font-medium">Rating:</p>
      <div className="flex flex-wrap justify-start items-center gap-x-5 gap-y-2">
        {rating.map((star) => {
          return (
            <button
              className="flex flex-row justify-start items-center h-10 p-2 hover:ring-4 hover:ring-green-200 border-1 border-gray-200 rounded-lg transition shadow-md"
              key={star}
            >
              <div className="flex flex-row items-center gap-2">
                <p className="style-body-2 text-gray-400">{star}</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
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
