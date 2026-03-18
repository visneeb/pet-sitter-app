import { BookingProvider } from "@/contexts/BookingContext";
import Navbar from "@/components/common/nav-bar/Navbar";


export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Navbar />
    <BookingProvider>
      {children}
    </BookingProvider>
    </>
  );
}