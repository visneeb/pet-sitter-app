import { usePetSitterData } from "../../../hooks/usePetSitterData";
import PetSitterCard from "../PetSitterCard";

export default function ListMode() {
  const petSitterData = usePetSitterData();

  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 gap-4">
        {petSitterData.map((sitter) => (
          <PetSitterCard key={sitter.id} sitter={sitter} />
        ))}
      </div>
    </section>
  );
}
