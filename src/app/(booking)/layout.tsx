import { BookingProvider } from "@/contexts/BookingContext";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      {/* ใส่ shell + background + 2 columns ของ Ikq */}
      {children}
    </BookingProvider>
  );
}