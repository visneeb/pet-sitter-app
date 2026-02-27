import cn from "@/utils/cn";
import { ChangeEvent, useCallback } from "react";

interface FilterSearchTypeListProps {
  petTypes: string[];
  onPetTypesChange: (petTypes: string[]) => void;
  contentStyle?: string;
  listStyle?: string;
}

export default function FilterSearchTypeList({
  petTypes,
  onPetTypesChange,
  contentStyle,
  listStyle,
}: FilterSearchTypeListProps) {
  const petType = ["Dog", "Cat", "Bird", "Rabbit"];

  const handlePetTypeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      if (checked) {
        onPetTypesChange([...petTypes, value]);
      } else {
        onPetTypesChange(petTypes.filter((pet) => pet !== value));
      }
    },
    [onPetTypesChange, petTypes],
  );

  return (
    <div className={cn("flex flex-col gap-2", contentStyle)}>
      <p className="style-body-2 text-gray-600">Pet Type:</p>
      <div className={cn("flex flex-wrap justify-start gap-x-5 gap-y-2",listStyle)}>
        {petType.map((pet) => {
          return (
            <label
              key={pet}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={pet}
                className="checkbox border-gray-200 text-white bg-white checked:text-white checked:bg-orange-500 checked:shadow-lg checked:border-orange-300 checked:outline-1 hover:border-orange-300  hover:shadow-lg"
                checked={petTypes.includes(pet)}
                onChange={handlePetTypeChange}
              />
              <span className="style-body-2 text-gray-600 group-hover:text-orange-600 transition">
                {pet}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
