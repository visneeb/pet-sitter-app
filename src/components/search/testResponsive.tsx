"use client";

import { useScreenContext } from "@/contexts/ScreenContext";
import useScreen from "@/hooks/useScreen";

export default function TestResponsive() {
  const { isSmall, isMedium, isLarge, isXLarge, is2XLarge } =
    useScreenContext();

  return (
    <div className="fixed top-2 right-4 z-[9999] bg-black/80 text-white p-4 rounded-xl shadow-lg font-mono text-sm flex flex-col gap-2 pointer-events-none">
      <h4 className="font-bold border-b border-gray-600 pb-1 mb-1 text-center">
        Screen Size
      </h4>
      <div className="flex justify-between gap-4">
        <span className="text-gray-400">isSmall (≥640px):</span>{" "}
        <span className={isSmall ? "text-green-400 font-bold" : "text-red-400"}>
          {isSmall ? "TRUE" : "false"}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-gray-400">isMedium (≥768px):</span>{" "}
        <span
          className={isMedium ? "text-green-400 font-bold" : "text-red-400"}
        >
          {isMedium ? "TRUE" : "false"}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-gray-400">isLarge (≥1024px):</span>{" "}
        <span className={isLarge ? "text-green-400 font-bold" : "text-red-400"}>
          {isLarge ? "TRUE" : "false"}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-gray-400">isXLarge (≥1280px):</span>{" "}
        <span
          className={isXLarge ? "text-green-400 font-bold" : "text-red-400"}
        >
          {isXLarge ? "TRUE" : "false"}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-gray-400">is2XLarge (≥1536px):</span>{" "}
        <span
          className={is2XLarge ? "text-green-400 font-bold" : "text-red-400"}
        >
          {is2XLarge ? "TRUE" : "false"}
        </span>
      </div>
    </div>
  );
}
