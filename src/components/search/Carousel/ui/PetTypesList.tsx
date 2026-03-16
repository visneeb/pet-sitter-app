import cn from "@/utils/cn";
import { Tag } from "../../ui/Tag";

interface PetTypesListProps {
  petTypes: string[];
  tagClassName?: string;
  containerClassName?: string;
}

export default function PetTypesList({ petTypes, tagClassName ,containerClassName}: PetTypesListProps) {
    const containerStyle = cn("flex flex-row flex-wrap gap-2 h-8 w-full overflow-hidden", containerClassName);
  return (
    <div className={containerStyle}>
      {petTypes.map((petType, petTypeIndex) => (
        <Tag key={petTypeIndex} label={petType} index={petTypeIndex} className={tagClassName} />
      ))}
    </div>
  );
}
