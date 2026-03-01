import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import FilterRatingList from "../search/FilterSideBar/FilterRatingList";
import FilterSearchTypeList from "../search/FilterSideBar/FilterSearchTypeList";
import FilterExperience from "../search/FilterSideBar/FilterExperience";
import { ActionButton } from "../ui/Button";
import cn from "@/utils/cn";

export default function SearchBar() {
  const {
    petTypes,
    rating,
    experience,
    handlePetTypesChange,
    handleRatingChange,
    handleExperienceChange,
    handleNavigateToSearch,
  } = usePetSitterSearch();

  return (
    <section
      className={cn(
        "flex flex-col justify-center items-center mb-[35px]",
        // Mobile (Base)
        "w-[375px] min-w-[343px] mt-2 px-4 mx-auto",
        // Tablet (sm)
        "sm:w-[400px] sm:min-w-[375px]",
        // Desktop (xl)
        "xl:w-auto xl:min-w-[343px] xl:mt-[64px] xl:px-[188px] xl:mx-0",
      )}
    >
      <div
        className={cn(
          "flex justify-start items-center rounded-t-2xl",
          // Mobile & Tablet
          "bg-gray-50 flex-col items-start w-full p-4 pt-6 pb-4",
          // Desktop (xl)
          "xl:bg-gray-100 xl:flex-row xl:w-[1064px] xl:h-[72px] xl:p-6",
        )}
      >
        <FilterSearchTypeList
          petTypes={petTypes}
          onPetTypesChange={handlePetTypesChange}
          contentStyle={cn(
            "flex-col gap-4 w-full",
            "xl:flex-row xl:gap-3 xl:w-auto",
          )}
          listStyle={cn("gap-x-[16px]", "xl:gap-x-[26px]")}
        />
      </div>
      <div
        className={cn(
          "bg-white flex justify-start",
          // Mobile & Tablet
          "flex-col items-start w-full p-4 pt-4 pb-6 gap-6 rounded-b-2xl shadow-[0px_4px_10px_rgba(0,0,0,0.05)]",
          // Desktop (xl)
          "xl:flex-row xl:items-center xl:w-[1064px] xl:h-[96px] xl:p-6 xl:gap-6 xl:rounded-none xl:rounded-b-2xl xl:shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]",
        )}
      >
        <FilterRatingList
          rating={rating}
          onRatingChange={handleRatingChange}
          contentStyle={cn(
            "flex-col items-start gap-4 w-full",
            "xl:flex-row xl:items-center xl:gap-3 xl:w-auto",
          )}
          listStyle="gap-x-2"
        />
        <FilterExperience
          experience={experience}
          onExperienceChange={handleExperienceChange}
          contentStyle={cn(
            "flex-col items-start gap-4 w-full",
            "xl:flex-row xl:items-center xl:gap-3 xl:w-auto",
          )}
          listStyle={cn("w-full h-[48px]", "xl:w-[144px] xl:h-[48px]")}
        />
        <ActionButton
          variant="primary"
          onClick={handleNavigateToSearch}
          className={cn(
            "w-full h-[48px] mt-2",
            "xl:w-[120px] xl:h-[48px] xl:mt-0",
          )}
        >
          Search
        </ActionButton>
      </div>
    </section>
  );
}
