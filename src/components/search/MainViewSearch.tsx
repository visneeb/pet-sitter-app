import { useSearchParams } from "next/navigation";
import ListMode from "./ViewMode/ListMode";
import MapMode from "./ViewMode/MapMode";
export default function MainViewSearch() {
  const searchParams = useSearchParams();
  // Read directly from URL. Default to 'list' if not found.
  const viewMode = searchParams?.get("view") || "list";
  return (
    <main className="max-w-[850px] w-[850px] h-fit flex flex-col justify-start items-center rounded-2xl ">
      {viewMode === "list" ? <ListMode /> : <MapMode />}
    </main>
  );
}
