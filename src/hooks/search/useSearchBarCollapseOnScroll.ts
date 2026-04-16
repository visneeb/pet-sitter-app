"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Desktop (lg): เมื่อ scroll แถบค้นหาเลื่อนขึ้นใต้ Filter sidebar (sticky)
 * อัปเดต --search-bar-collapse บน section (0–1) สำหรับ scale/opacity โดยไม่ re-render
 */
export function useSearchBarCollapseOnScroll(
  columnRef: RefObject<HTMLDivElement | null>,
  searchSectionRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      const root = columnRef.current;
      const search = searchSectionRef.current;
      if (!search) return;

      if (!mq.matches || !root) {
        search.style.setProperty("--search-bar-collapse", "0");
        return;
      }

      const aside = root.querySelector("aside");
      if (!(aside instanceof HTMLElement)) {
        return;
      }

      const fr = aside.getBoundingClientRect();
      const sr = search.getBoundingClientRect();
      const passed = fr.bottom - sr.top;
      const h = Math.max(sr.height, 1);
      const p = Math.min(1, Math.max(0, passed / h));
      search.style.setProperty("--search-bar-collapse", String(p));
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, [columnRef, searchSectionRef]);
}
