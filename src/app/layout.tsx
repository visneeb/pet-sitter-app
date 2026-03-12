//global layout จัดการ layout
// ถ้าหน้าอื่นอยากให้มี layout แบบอื่น ให้สร้าง file layout.tsx ขึ้นใน folder นั้นๆ

import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import { Toaster } from "sonner";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" data-theme="light" className={cn("font-sans", figtree.variable)}>
      <body className={`antialiased`}>
        <AppProviders>
          {children}
          <script src="./assets/vendor/canvas-confetti/dist/confetti.browser.js">
          </script>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
