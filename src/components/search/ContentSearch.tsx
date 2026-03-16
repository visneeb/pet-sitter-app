import FilterSideBar from "./FilterSideBar";
import MainViewSearch from "./MainViewSearch";

export default function ContentSearch() {
    return (
      <div className="w-full flex flex-nowrap justify-center px-[92px] gap-9">
        <FilterSideBar />
        <MainViewSearch/>
      </div>
    );
}