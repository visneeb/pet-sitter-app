import cn from "@/utils/cn";

import PetSitterCard from "../PetSitterCard";
import PetSitterCardSkeleton from "../PetSitterCard/PetSitterCardSkeleton";
import { useScreenContext } from "@/contexts/ScreenContext";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";

export default function ListMode() {
  const { petSitters, isLoading } = usePetSitterSearch();
  const { isLarge, isXLarge } = useScreenContext();
  const isWebViewMini = isLarge && !isXLarge;

  return (
    <section className="flex flex-col gap-6 w-full">
      <div
        className={cn(
          "w-full grid grid-cols-1 gap-4 justify-items-center items-center",
          isWebViewMini && "justify-start grid-cols-1",
        )}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <PetSitterCardSkeleton key={i} />
          ))
        ) : petSitters.length === 0 ? (
          <p className="text-gray-400 text-center py-12 style-body-1">
            No pet sitters found matching your criteria.
          </p>
        ) : (
          petSitters.map((sitter, index) => (
            <PetSitterCard
              key={sitter.id}
              sitter={sitter}
              priority={index === 0}
            />
          ))
        )}
      </div>
    </section>
  );
}
