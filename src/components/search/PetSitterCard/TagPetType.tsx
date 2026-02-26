import { PetSitter } from "@/types/PetSittersType";
import { Tag } from "../ui/Tag";

export default function TagePetType({
  sitter,
}: Readonly<{ sitter: PetSitter }>) {
  return (
    <div className="flex flex-wrap gap-2">
      {sitter.petTypes.map((tag, index) => (
        <Tag key={tag} label={tag} index={index} />
      ))}
    </div>
  );
}
