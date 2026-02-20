"use client";

import { createContext, useContext } from "react";
import useScreen, { ScreenSize } from "@/hooks/useScreen";

const ScreenContext = createContext<ScreenSize>({
  isSmall: false,
  isMedium: false,
  isLarge: false,
  isXLarge: false,
  is2XLarge: false,
});

export function ScreenProvider({ children }: { children: React.ReactNode }) {
  const screen = useScreen();

  return (
    <ScreenContext.Provider value={screen}>{children}</ScreenContext.Provider>
  );
}

export function useScreenContext() {
  return useContext(ScreenContext);
}
