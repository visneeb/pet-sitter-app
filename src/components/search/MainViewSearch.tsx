import { useSearchParams } from "next/navigation";
import ListMode from "./ViewMode/ListMode";
import MapMode from "./ViewMode/MapMode";
import cn from "@/utils/cn";
import useSelectMaker from "@/hooks/search/map/useSelectMaker";

export default function MainViewSearch() {
  const searchParams = useSearchParams();
  // Read directly from URL. Default to 'list' if not found.
  const viewMode = searchParams?.get("view") || "list";
  const { selectedMarker, handleSelectPetSitter } = useSelectMaker();

  return (
    <main
      className={cn(
        "max-w-[850px] w-full h-fit flex flex-col justify-start items-center rounded-2xl ",
        "justify-center items-center",
        "lg:justify-start lg:items-center",
      )}
    >
      {viewMode === "list" ? (
        <ListMode />
      ) : (
        <MapMode
          selectedMarker={selectedMarker}
          handleSelectPetSitter={handleSelectPetSitter}
        />
      )}
    </main>
  );
}
