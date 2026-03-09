"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ViewMode, VIEW_PARAM_KEY, DEFAULT_VIEW } from "@/constants/viewMode";

const isViewMode = (v: string | null): v is ViewMode => v === "list" || v === "map";

export function useViewMode() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get(VIEW_PARAM_KEY);
  const currentView: ViewMode = isViewMode(raw) ? raw : DEFAULT_VIEW;

  const changeView = useCallback(
    (mode: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(VIEW_PARAM_KEY, mode);

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      // ถ้าคุณ “อยากให้ back ย้อนมุมมองได้” เปลี่ยน replace -> push
    },
    [router, pathname, searchParams]
  );

  return { currentView, changeView };
}