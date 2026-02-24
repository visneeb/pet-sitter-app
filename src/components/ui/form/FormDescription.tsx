"use client";

export function FormDescription({ children }: { children?: React.ReactNode }) {
  if (!children) return null;

  return <p className="style-body-3 text-muted-foreground">{children}</p>;
}
