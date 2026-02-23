"use client";
import Image from "next/image";
import Link from "next/link";
import ConnectWithSitters from "@/assets/ContentSection/ConnectWithSitters.png";
import CallingAllPets from "@/assets/ContentSection/CallingAllPets.png";
import BetterForYourPets from "@/assets/ContentSection/BetterForYourPets.png";
import PetImage from "@/assets/ContentSection/lovely-pet-portrait-isolated 1.png";
import { HalfEllipse, FullEllipse } from "@/decorations/Ellipse";
import { Star } from "@/decorations/Shapes";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
import ServiceCard from "@/components/home/ServiceCard";
import FeatureCard from "@/components/home/FeatureCard";

const services = [
  {
    title: "Boarding",
    description:
      "Your pets stay overnight in your sitter's home. They'll be treated like part of the family in a comfortable environment.",
    iconColor: "text-blue-500",
  },
  {
    title: "House Sitting",
    description:
      "Your sitter takes care of your pets and your home. Your pets will get all the attention they need without leaving home.",
    iconColor: "text-pink-500",
  },
  {
    title: "Dog Walking",
    description:
      "Your dog gets a walk around your neighborhood. Perfect for busy days and dogs with extra energy to burn.",
    iconColor: "text-green-500",
  },
  {
    title: "Drop-In Visits",
    description:
      "Your sitter drops by your home to play with your pets, offer food, and give potty breaks or clean the litter box.",
    iconColor: "text-yellow-500",
  },
] as const;

const features = [
  {
    image: ConnectWithSitters,
    alt: "Connect With Sitters",
    highlightedWord: "Connect",
    restOfTitle: "with Sitters",
    highlightColor: "text-green-500",
    description:
      "Find a verified and reviewed sitter who'll keep your pets company and give time.",
  },
  {
    image: BetterForYourPets,
    alt: "Better For Your Pets",
    highlightedWord: "Better",
    restOfTitle: "For Your Pets",
    highlightColor: "text-blue-500",
    description:
      "Pets stay happy at home with a sitter who gives them loving care and companionship.",
  },
  {
    image: CallingAllPets,
    alt: "Calling All Pets",
    highlightedWord: "Calling",
    restOfTitle: "All Pets",
    highlightColor: "text-orange-500",
    description:
      "Stay for free with adorable animals in unique homes around the world.",
  },
] as const;

export default function Content() {
  const { isMedium } = useScreenContext();

  return (
    <>
      <div className={`flex flex-col gap-32 p-10`}>
        <div
          className={cn(
            "flex text-center justify-center",
            isMedium ? "style-headline-2" : "style-headline-3",
          )}
        >
          "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
        </div>

        <div className="flex flex-col md:flex-row justify-between mx-auto max-w-[1064px] gap-24">
          <div className="flex flex-col gap-14 max-w-[504px]">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                iconColor={service.iconColor}
              />
            ))}
          </div>
          <Image src={PetImage} alt="Pet Image" className="object-cover" />
        </div>

        <div className="flex flex-col md:flex-row justify-center max-w-[1280px] mx-auto gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.alt}
              image={feature.image}
              alt={feature.alt}
              highlightedWord={feature.highlightedWord}
              restOfTitle={feature.restOfTitle}
              highlightColor={feature.highlightColor}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      {/* Perfect Pet Sitter Section */}
      <section className="relative overflow-hidden bg-yellow-100 py-20  flex flex-col items-center justify-center gap-10 md:mx-20 md:my-20 md:rounded-2xl ">
        <HalfEllipse className="absolute bottom-0 -left-5 w-62 h-31 text-blue-500" />
        <FullEllipse
          className={cn(
            "absolute -top-15 -right-3 text-yellow-200",
            isMedium ? "w-60 h-60" : "w-33 h-33",
          )}
        />
        <Star className={cn("absolute right-40 top-27 text-green-500", isMedium ? "w-47 h-47 rotate-5 " : "  w-28 h-27")} />

        <div className="relative z-10 flex flex-col items-center gap-8 mx-4">
          <h2 className="style-headline-2 text-center text-black mt-12">
            Perfect Pet Sitter
            <br />
            For Your Pet
          </h2>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-md">
            <Link href="/register">
              <button
                type="button"
                className="w-full px-8 py-3 style-button text-orange-500 rounded-full hover:underline hover:cursor-pointer transition-colors"
              >
                Become A Pet Sitter
              </button>
            </Link>
            <Link href="/find-a-pet-sitter">
              <button
                type="button"
                className="w-full px-8 py-3 style-button text-white bg-orange-500 rounded-full hover:bg-orange-400 hover:cursor-pointer transition-colors"
              >
                Find A Pet Sitter
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
