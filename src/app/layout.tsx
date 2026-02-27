//global layout จัดการ layout
// ถ้าหน้าอื่นอยากให้มี layout แบบอื่น ให้สร้าง file layout.tsx ขึ้นใน folder นั้นๆ

import type { Metadata } from "next";
import "./globals.css";
import { ScreenProvider } from "@/contexts/ScreenContext";
export const metadata: Metadata = {
  title: "Pet Sitter",
  description: "Perfect pet sitter with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`antialiased`}>
        <ScreenProvider>{children}</ScreenProvider>
      </body>
    </html>
  );
}
