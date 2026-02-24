import FilterSearchInput from "./FilterSideBar/FilterSearchInput";
import FilterSearchTypeList from "./FilterSideBar/FilterSearchTypeList";
import FilterRatingList from "./FilterSideBar/FilterRatingList";
import FilterActions from "./FilterSideBar/FilterActions";
import FilterExperience from "./FilterSideBar/FilterExperience";
import useFilterPetSitter from "@/hooks/pet-sitter-page/useFilterPetSitter";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";

export default function FilterSidebar() {
  const {
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
  } = useFilterPetSitter();
  const { isSmall, isMedium, isLarge } = useScreenContext();
  const isWebView = isSmall && isMedium && isLarge;
  return (
    <aside
      className={cn(
        "h-fit flex flex-col gap-8",
        isWebView
          ? "sticky top-20 w-98 bg-white shadow-lg rounded-2xl px-6 py-6"
          : "w-[375px] px-4 py-4",
      )}
    >
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
