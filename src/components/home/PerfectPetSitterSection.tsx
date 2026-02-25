import { HalfEllipse, FullEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";
import { NavigationButton } from "@/components/ui/Button";
import cn from "@/utils/cn";

const sectionClassName =
  "relative overflow-hidden bg-yellow-100 py-20 flex flex-col items-center justify-center gap-10 md:mx-20 md:my-20 md:rounded-2xl";

const halfEllipseClassName = "absolute bottom-0 -left-5 w-62 h-31 text-blue-500";

const fullEllipseClassName = cn(
  "absolute text-yellow-200",
  "w-30 h-46 -top-15 -right-3",
  "md:w-46 md:h-60 md:-top-15 md:-right-3",
  "lg:w-60 lg:h-60 lg:-top-15 lg:-right-3",
);

const starClassName = cn(
  "absolute text-green-500 rotate-10",
  "w-23 h-23 right-20 top-12",
  "md:w-37 md:h-47 md:right-30 md:top-20",
  "lg:w-47 lg:h-47 lg:right-40 lg:top-27",
);

export default function PerfectPetSitterSection() {
  return (
    <section className={sectionClassName}>
      <HalfEllipse className={halfEllipseClassName} />
      <FullEllipse className={fullEllipseClassName} />
      <Star className={starClassName} />

      <div className="relative z-10 flex flex-col items-center gap-8 mx-4">
        <h2 className="style-headline-2 text-center text-black mt-12">
          Perfect Pet Sitter
          <br />
          For Your Pet
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-md">
          <NavigationButton
            variant="secondary"
            href="/register"
            className="w-full"
          >
            Become A Pet Sitter
          </NavigationButton>
          <NavigationButton
            variant="primary"
            href="/find-a-pet-sitter"
            className="w-full"
          >
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </section>
  );
}
