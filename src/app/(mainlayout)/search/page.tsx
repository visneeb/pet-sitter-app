import type { Metadata } from "next";
import SearchPageClientShell from "@/components/search/SearchPageClientShell";

// ── Layout Constants ────────────────────────────────────────
const PAGE_STYLES = {
  minHeight: "min-h-[375px]",
  bgColor: "bg-[#FAFAFB]",
  flexDirection: "flex-col justify-between items-start",
} as const;

export const metadata: Metadata = {
  title: "Pet Sitter Search",
  description: "Search for a pet sitter",
};

export default function SearchPage() {
  return (
    <main
      className={`${PAGE_STYLES.minHeight} ${PAGE_STYLES.bgColor} text-gray-900 flex ${PAGE_STYLES.flexDirection}`}
    >
      <SearchPageClientShell />
    </main>
  );
}
