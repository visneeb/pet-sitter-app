import { CustomSelect } from "@/components/ui/CustomSelect";
import { useState } from "react";

interface FilterExperienceProps{
  experience: string;
  onExperienceChange: (experience: string) => void;
}

export default function FilterExperience({ experience, onExperienceChange }: FilterExperienceProps) {
   
  const handleExperienceChange = (experience: string) => {

    onExperienceChange(experience);
  };

    return (
             <div className="flex flex-col gap-2 ">
        <label htmlFor="experience" className="style-body-2 ">
          Experience:
        </label>
        <CustomSelect
          options={["0-3 Years", "3-5 Years", "5+ Years"]}
          value={experience}
          onChange={handleExperienceChange}
        />
      </div>
    );
}