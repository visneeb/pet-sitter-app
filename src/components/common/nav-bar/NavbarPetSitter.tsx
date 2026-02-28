"use client";
import Link from "next/link";
import { useScreenContext } from "@/contexts/ScreenContext";
import { CommentsAltIcon } from "@/assets/icons/components/icons";
import { NavigationButton } from "@/components/ui/Button";
export default function NavbarPetSitter() {
  const { isMedium } = useScreenContext();

  return (
    <div
      className={`relative flex items-center justify-between bg-white w-full style-body-2 
        ${isMedium ? "h-20 px-15 py-4" : "px-4 py-3"}`}
    >
      <div className="flex items-center justify-center text-center">
        <div className="flex items-center gap-2 p-2 hover:cursor-pointer hover:bg-gray-100 rounded-full">
          <div className="rounded-full bg-gray-200 w-10 h-10 shrink-0" />
          {isMedium && (
            <h1 className="style-body-2 text-gray-600 text-center">
              Jane Maison
            </h1>
          )}
        </div>
      </div>

      <Link

        href="/messages"
        className="flex items-center justify-center rounded-full bg-gray-100 w-10 h-10 hover:bg-gray-200 "
      >
        <CommentsAltIcon className="w-6 h-6 text-gray-400" />
      </Link>
    </div>
  );
}
