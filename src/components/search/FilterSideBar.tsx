import FilterSearchInput from "./FilterSideBar/FilterSearchInput";
import FilterSearchTypeList from "./FilterSideBar/FilterSearchTypeList";
import FilterRatingList from "./FilterSideBar/FilterRatingList";
import FilterActions from "./FilterSideBar/FilterActions";
import FilterExperience from "./FilterSideBar/FilterExperience";

export default function FilterSidebar() {
  // const [experience, setExperience] = useState("0-2 Years");
  // const petType = ["Dog", "Cat", "Bird", "Rabbit"]; typelist need
  // const rating = [5, 4, 3, 2, 1];

  return (
    <aside className="sticky top-20 w-98 h-fit px-6 py-6 bg-white shadow-lg rounded-2xl flex flex-col gap-8">
      <FilterSearchInput />
      <FilterSearchTypeList />
      <FilterRatingList />
      <FilterExperience />
      <FilterActions />
    </aside>
  );
}
