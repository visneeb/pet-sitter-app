import { ChangeEvent, useCallback } from "react";

interface FilterSearchTypeListProps {
  petTypes: string[];
  onPetTypesChange: (petTypes: string[]) => void;
}

export default function FilterSearchTypeList({
  petTypes,
  onPetTypesChange,
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
    <div className="flex flex-col gap-2 ">
      <p className="style-body-2 ">Pet Type:</p>
      <div className="flex flex-wrap justify-start gap-x-5 gap-y-2">
        {petType.map((pet) => {
          return (
            <label
              key={pet}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={pet}
                className="checkbox checked:bg-orange-400 checked:text-orange-800 checked:shadow-lg hover:bg-orange-200 hover:text-orange-800 hover:shadow-lg"
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
