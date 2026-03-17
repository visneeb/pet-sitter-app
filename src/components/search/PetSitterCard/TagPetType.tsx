import { Tag } from "../ui/Tag";

interface TagPetTypeProps {
  sitter: { petTypes: string[] };
}

export default function TagPetType({ sitter }: Readonly<TagPetTypeProps>) {
  return (
    <div className="flex flex-wrap gap-2">
      {sitter.petTypes.map((tag, index) => (
        <Tag key={index} label={tag}/>
      ))}
    </div>
  );
}
