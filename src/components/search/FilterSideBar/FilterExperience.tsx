import { CustomSelect } from "@/components/ui/CustomSelect";
import cn from "@/utils/cn";
import { useState } from "react";

interface FilterExperienceProps {
  experience: string;
  onExperienceChange: (experience: string) => void;
  contentStyle?: string;
  listStyle?: string;
}

export default function FilterExperience({
  experience,
  onExperienceChange,
  contentStyle,
  listStyle,
}: FilterExperienceProps) {
  const handleExperienceChange = (experience: string) => {
    onExperienceChange(experience);
  };

  return (
    <div className={cn("flex flex-col gap-2", contentStyle)}>
      <label htmlFor="experience" className="style-body-2 text-gray-600 ">
        Experience:
      </label>
      <CustomSelect
        options={["0-3 Years", "3-5 Years", "5+ Years"]}
        value={experience}
        onChange={handleExperienceChange}
        className={listStyle}
      />
    </div>
  );
}
