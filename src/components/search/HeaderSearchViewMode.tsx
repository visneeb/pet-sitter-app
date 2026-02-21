import { List, Map } from "lucide-react";
import {
  useRouter,
  useSearchParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
export default function HeaderSearchViewMode() {
  const router = useRouter();
  const searchParams: ReadonlyURLSearchParams | null = useSearchParams();
  const currentView = searchParams?.get("view") || "list";

  const changeView = (mode: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "list");
    params.set("view", mode);
    router.push(`?${params.toString()}`); // Updates URL
  };

  const activeStyle =
    "w-20 h-10 hover:ring-4 hover:ring-orange-200 text-orange-500 border-1 border-orange-500 rounded-lg transition shadow-md";
  const inactiveStyle =
    "w-20 h-10 hover:ring-4 hover:ring-gray-200 text-gray-300 border-1 border-gray-300 rounded-lg transition shadow-md";

  return (
    <header className=" flex flex-row justify-between items-center w-full h-22 px-[92px]">
      <h3 className="style-headline-3">Search For Pet Sitter</h3>
      <div className="flex flex-row gap-3">
        <button
          onClick={() => changeView("list")}
          className={currentView === "list" ? activeStyle : inactiveStyle}
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <List />
            <p className="style-body-2">List</p>
          </div>
        </button>
        <button
          onClick={() => changeView("map")}
          className={currentView === "map" ? activeStyle : inactiveStyle}
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <Map />
            <p className="style-body-2">Map</p>
          </div>
        </button>
      </div>
    </header>
  );
}
