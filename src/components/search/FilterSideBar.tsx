import FilterSearchInput from "./FilterSideBar/FilterSearchInput";
import FilterSearchTypeList from "./FilterSideBar/FilterSearchTypeList";
import FilterRatingList from "./FilterSideBar/FilterRatingList";
import FilterActions from "./FilterSideBar/FilterActions";
import FilterExperience from "./FilterSideBar/FilterExperience";
import { usePetSitterSearch } from "@/contexts/PetSitterSearchContext";
import cn from "@/utils/cn";
import { useId } from "react";
import { useForm, useController } from "react-hook-form";
import { Form } from "@/components/form";

type SearchFilterFormValues = {
  searchText: string;
  petTypes: string[];
  rating: number[];
  experience: string;
};

export default function FilterSideBar() {
  const headingId = useId();

  const { searchText, petTypes, rating, experience, handleClear, handleSearchWithFilters } =
    usePetSitterSearch();

  const methods = useForm<SearchFilterFormValues>({
    defaultValues: {
      searchText,
      petTypes,
      rating,
      experience,
    },
  });

  const { control, reset } = methods;

  const { field: searchTextField } = useController({
    name: "searchText",
    control,
  });

  const { field: petTypesField } = useController({
    name: "petTypes",
    control,
  });

  const { field: ratingField } = useController({
    name: "rating",
    control,
  });

  const { field: experienceField } = useController({
    name: "experience",
    control,
  });

  const handleFormSubmit = (values: SearchFilterFormValues) => {
    // Apply the submitted filters directly and trigger search in one step
    handleSearchWithFilters({
      searchText: values.searchText,
      petTypes: values.petTypes,
      rating: values.rating,
      experience: values.experience,
    });
  };

  const handleFormClear = () => {
    const emptyValues: SearchFilterFormValues = {
      searchText: "",
      petTypes: [],
      rating: [],
      experience: "",
    };

    reset(emptyValues);

    // Apply cleared filters through context so URL/query stay in sync
    handleSearchWithFilters({
      searchText: emptyValues.searchText,
      petTypes: emptyValues.petTypes,
      rating: emptyValues.rating,
      experience: emptyValues.experience,
    });
    handleClear();
  };

  return (
    <aside
      className={cn(
        "h-fit flex flex-col gap-8 w-[375px] px-4 py-4",
        "lg:sticky lg:top-30 lg:w-[392px] lg:bg-white lg:rounded-2xl lg:px-6 lg:py-6 lg:shadow-[4px_4px_24px_0_rgba(0,0,0,0.04)]",
      )}
      aria-labelledby={headingId}
    >
      <Form
        methods={methods}
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-8"
      >
        <FilterSearchInput
          searchText={searchTextField.value}
          onSearchChange={(value) => searchTextField.onChange(value)}
          label="Search"
        />
        <FilterSearchTypeList
          petTypes={petTypesField.value}
          onPetTypesChange={(value) => petTypesField.onChange(value)}
        />
        <FilterRatingList
          rating={ratingField.value}
          onRatingChange={(value) => ratingField.onChange(value)}
        />
        <FilterExperience
          experience={experienceField.value}
          onExperienceChange={(value) => experienceField.onChange(value)}
        />
        <FilterActions onClear={handleFormClear} />
      </Form>
    </aside>
  );
}
