import { useSearchParams } from "next/navigation";
import ListMode from "./ViewMode/ListMode";
import MapMode from "./ViewMode/MapMode";
import cn from "@/utils/cn";
import { useScreenContext } from "@/contexts/ScreenContext";
export default function MainViewSearch() {
  const searchParams = useSearchParams();
  // Read directly from URL. Default to 'list' if not found.
  const viewMode = searchParams?.get("view") || "list";
  const { isSmall } = useScreenContext();
  const isWebView = isSmall ;
  return (
    <main
      className={cn(
        "max-w-[850px] w-full h-fit flex flex-col justify-start items-center rounded-2xl ",
        isWebView ? "justify-start items-center":"justify-center items-center"
      )}
    >
      {viewMode === "list" ? <ListMode /> : <MapMode />}
    </main>
  );
}
