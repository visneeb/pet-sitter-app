import Footer from "@/components/common/footer/Footer";

export default function PetSitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <h1>Component Navbar here !</h1>
        <main>{children}</main>
        <Footer />
    </div>
  );
}