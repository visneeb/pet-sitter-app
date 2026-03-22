import { BookingProvider } from "@/contexts/BookingContext";
import Navbar from "@/components/common/nav-bar/Navbar";
import BookingLayoutInner from "@/views/layout/BookingLayoutInner";
import { StripeProvider } from "@/components/booking/stripe/StripeProvider";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-gray z-1">
      <Navbar />
      <BookingProvider>
        <StripeProvider>
          <BookingLayoutInner>
            <div className="z-20">{children}</div>
          </BookingLayoutInner>
        </StripeProvider>
      </BookingProvider>
    </main>
  );
}
