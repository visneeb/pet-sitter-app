"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SeedContextType {
  seed: string;
  setSeed: (value: string) => void;
  regenerateSeed: () => string;
}

const SeedContext = createContext<SeedContextType | null>(null);

const generateSeed = () => Math.random().toString(36).substring(2, 10);

interface SeedProviderProps {
  children: ReactNode;
}

export function SeedProvider({ children }: Readonly<SeedProviderProps>) {
  const [seed, setSeed] = useState(generateSeed);

  const regenerateSeed = useCallback(() => {
    const newSeed = generateSeed();
    setSeed(newSeed);
    return newSeed;
  }, []);

  const value = useMemo(
    () => ({
      seed,
      setSeed,
      regenerateSeed,
    }),
    [seed, regenerateSeed],
  );

  return <SeedContext.Provider value={value}>{children}</SeedContext.Provider>;
}

export function useSeed() {
  const context = useContext(SeedContext);
  if (!context) {
    throw new Error("useSeed must be used within a SeedProvider");
  }
  return context;
}
