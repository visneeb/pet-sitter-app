import { CustomSelect } from "@/components/ui/CustomSelect";
import { useState } from "react";

export default function FilterExperience() {
    const [experience, setExperience] = useState("0-2 Years");
    return (
             <div className="flex flex-col gap-2 ">
        <label htmlFor="experience" className="style-body-2 ">
          Experience:
        </label>
        <CustomSelect
          options={["0-2 Years", "3-5 Years", "5+ Years"]}
          value={experience}
          onChange={setExperience}
        />
      </div>
    );
}