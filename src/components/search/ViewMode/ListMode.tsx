import { dir } from "console";
import { usePetSitterData } from "../../../hooks/usePetSitterData";
import PetSitterCard from "../PetSitterCard";
import Loading from "@/components/common/loading/loading";

export default function ListMode() {
  const petSitterData = usePetSitterData();

  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 gap-4">
        {petSitterData.length === 0 ? (
          <Loading />
        ) : (
          petSitterData.map((sitter) => (
            <PetSitterCard key={sitter.id} sitter={sitter} />
          ))
        )}
      </div>
    </section>
  );
}
