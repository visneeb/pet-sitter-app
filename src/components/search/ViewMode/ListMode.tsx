import { usePetSitterData } from "../../../hooks/pet-sitter-page/usePetSitterData";
import PetSitterCard from "../PetSitterCard";
import Loading from "@/components/common/loading/loading";

export default function ListMode() {
  const petSitterData = usePetSitterData();

  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="w-full grid grid-cols-1 gap-4 justify-items-center">
        {petSitterData.length === 0 ? (
          <Loading />
        ) : (
          petSitterData.map((sitter, index) => (
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
