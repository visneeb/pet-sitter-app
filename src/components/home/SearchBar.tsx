import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import FilterRatingList from "../search/FilterSideBar/FilterRatingList";
import FilterSearchTypeList from "../search/FilterSideBar/FilterSearchTypeList";
import FilterExperience from "../search/FilterSideBar/FilterExperience";
import { ActionButton } from "../ui/Button";
import { useScreenContext } from "@/contexts/ScreenContext";
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

  const { isSmall, isMedium, isXLarge } = useScreenContext();
  const isWebView = isSmall && isMedium && isXLarge;
  const isMobile = !isSmall && !isMedium;
  return (
    <section
      className={cn(
        "flex justify-center items-center w-full min-w-[343px] min-h-[416px]",
        isWebView
          ? "flex-col px-[188px]"
          : "flex-col px-4 mx-auto mt-2 w-[400px] min-w-[375px]",
        isMobile ? "w-[375px]" : "",
      )}
    >
      <div
        className={cn(
          "flex justify-start items-center rounded-t-2xl",
          isWebView
            ? "bg-gray-100 w-[1064px] h-[72px] flex-row p-6"
            : "bg-gray-50 w-full flex-col items-start p-4 pt-6 pb-4",
        )}
      >
        <FilterSearchTypeList
          petTypes={petTypes}
          onPetTypesChange={handlePetTypesChange}
          contentStyle={cn(
            isWebView ? "flex-row gap-3" : "flex-col gap-4 w-full",
          )}
          listStyle={isWebView ? "gap-x-[26px]" : "gap-x-5"}
        />
      </div>
      <div
        className={cn(
          "bg-white flex justify-start items-center",
          isWebView
            ? "w-[1064px] h-[96px] flex-row p-6 gap-6"
            : "w-full flex-col items-start p-4 pt-4 pb-6 gap-6 rounded-b-2xl shadow-[0px_4px_10px_rgba(0,0,0,0.05)]",
        )}
      >
        <FilterRatingList
          rating={rating}
          onRatingChange={handleRatingChange}
          contentStyle={cn(
            isWebView
              ? "flex-row gap-3 items-center"
              : "flex-col items-start gap-4 w-full",
          )}
          listStyle="gap-x-2"
        />
        <FilterExperience
          experience={experience}
          onExperienceChange={handleExperienceChange}
          contentStyle={cn(
            isWebView
              ? "flex-row gap-3 items-center"
              : "flex-col items-start gap-4 w-full",
          )}
          listStyle={cn(isWebView ? "w-[144px] h-[48px]" : "w-full h-[48px]")}
        />
        <ActionButton
          variant="primary"
          onClick={handleNavigateToSearch}
          className={cn(
            isWebView ? "w-[120px] h-[48px]" : "w-full h-[48px] mt-2",
          )}
        >
          Search
        </ActionButton>
      </div>
    </section>
  );
}
