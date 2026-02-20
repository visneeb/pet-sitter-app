import { useEffect, useState } from "react";

export type ScreenSize = {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  is2XLarge: boolean;
};

function useScreen(): ScreenSize {
  const [screen, setScreen] = useState<ScreenSize>({
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
    is2XLarge: false,
  });

  useEffect(() => {
    // Prevent SSR crash
    if (typeof window === "undefined") return;

    const queries = {
      isSmall: window.matchMedia("(min-width: 40rem)"),
      isMedium: window.matchMedia("(min-width: 48rem)"),
      isLarge: window.matchMedia("(min-width: 64rem)"),
      isXLarge: window.matchMedia("(min-width: 80rem)"),
      is2XLarge: window.matchMedia("(min-width: 96rem)"),
    };

    const updateScreen = () => {
      setScreen({
        isSmall: queries.isSmall.matches,
        isMedium: queries.isMedium.matches,
        isLarge: queries.isLarge.matches,
        isXLarge: queries.isXLarge.matches,
        is2XLarge: queries.is2XLarge.matches,
      });
    };

    // Initial check
    updateScreen();

    // Add listeners
    Object.values(queries).forEach((query) =>
      query.addEventListener("change", updateScreen),
    );

    // Cleanup
    return () => {
      Object.values(queries).forEach((query) =>
        query.removeEventListener("change", updateScreen),
      );
    };
  }, []);

  return screen;
}

export default useScreen;
