import axios from "axios";
import { useState } from "react";

export default function useFilterPetSitter() {
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
    setExperience("0-3 Years");
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

  return {
    searchText,
    petTypes,
    rating,
    experience,
    handleSearchChange,
    handlePetTypesChange,
    handleRatingChange,
    handleExperienceChange,
    handleClear,
    handleSearch,
  };
}
