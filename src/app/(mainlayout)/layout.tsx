import Footer from "@/components/common/footer/Footer";
import Navbar from "@/components/common/nav-bar/Navbar";

export default function PetSitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </div>
  );
}