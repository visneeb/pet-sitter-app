import { Paw } from "@/decorations/Paw";
import { QuadrantEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Decorative layer */}

      <div className="pointer-events-none absolute inset-0 ">
        <Paw
          aria-hidden="true"
          className="absolute -right-7 top-[-60] md:top-10 w-40 md:w-56 transition-all duration-300 ease-in-out text-yellow-200 rotate-290"
        />

        <Star
          aria-hidden="true"
          className="absolute -left-22 -bottom-35 w-64 md:w-96 transition-all duration-300 ease-in-out text-green-500 rotate-38 opacity-0 md:opacity-100"
        />
        <QuadrantEllipse
          aria-hidden="true"
          className="absolute left-13 bottom-67 w-0 md:w-33 text-blue-500 transition-all duration-300 ease-in-out rotate-45 opacity-0 md:opacity-100 "
        />
      </div>
      {children}
    </main>
  );
}
