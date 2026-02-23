import FilterSearchInput from "./FilterSideBar/FilterSearchInput";
import FilterSearchTypeList from "./FilterSideBar/FilterSearchTypeList";
import FilterRatingList from "./FilterSideBar/FilterRatingList";
import FilterActions from "./FilterSideBar/FilterActions";
import FilterExperience from "./FilterSideBar/FilterExperience";
import { useState } from "react";
import axios from "axios";

export default function FilterSidebar() {
  const [searchText, setSearchText] = useState<string>("");
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [rating, setRating] = useState<number[]>([]);
  const [experience, setExperience] = useState<string>("0-3 Years");

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const handlePetTypesChange = (petTypes: string[]) => {
    setPetTypes(petTypes);
  };

  const handleRatingChange = (newRating: number[]) => {
    setRating(newRating);
  };

  const handleExperienceChange = (experience: string) => {
    setExperience(experience);
  };

  const handleClear = () => {
    setSearchText("");
    setPetTypes([]);
    setRating([]);
    setExperience("0-3 Years"); // reset กลับ default
  };

  const handleSearch = async () => {
    const query = {
      searchText,
      petTypes,
      rating,
      experience,
    };
    try {
      const request = await axios.get("http://localhost:4000/petSitter");
      console.log(request);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  return (
    <aside className="sticky top-20 w-98 h-fit px-6 py-6 bg-white shadow-lg rounded-2xl flex flex-col gap-8">
      <FilterSearchInput
        searchText={searchText}
        onSearchChange={handleSearchChange}
        label="Search"
      />
      <FilterSearchTypeList
        petTypes={petTypes}
        onPetTypesChange={handlePetTypesChange}
      />
      <FilterRatingList rating={rating} onRatingChange={handleRatingChange} />
      <FilterExperience
        experience={experience}
        onExperienceChange={handleExperienceChange}
      />
      <FilterActions
        searchText={searchText}
        petTypes={petTypes}
        rating={rating}
        experience={experience}
        onClear={handleClear}
        onSearch={handleSearch}
      />
    </aside>
  );
}
