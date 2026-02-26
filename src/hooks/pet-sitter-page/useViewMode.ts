"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ViewMode, VIEW_PARAM_KEY, DEFAULT_VIEW } from "@/constants/viewMode";

export function useViewMode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = (searchParams?.get(VIEW_PARAM_KEY) ?? DEFAULT_VIEW) as ViewMode;

  const changeView = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(VIEW_PARAM_KEY, mode);
    router.push(`?${params.toString()}`);
  };

  return { currentView, changeView };
}