import { PetSitter } from "@/hooks/usePetSitterData";
import { Tag } from "../ui/Tag";

export default function TagePetType({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex flex-wrap gap-2">
      {sitter.petTypes.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </div>
  );
}
