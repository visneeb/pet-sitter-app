import type { StaticImageData } from "next/image";
import ConnectWithSitters from "@/assets/ContentSection/ConnectWithSitters.png";
import CallingAllPets from "@/assets/ContentSection/CallingAllPets.png";
import BetterForYourPets from "@/assets/ContentSection/BetterForYourPets.png";
import PetImage from "@/assets/ContentSection/lovely-pet-portrait-isolated 1.png";

export interface ServiceItem {
  title: string;
  description: string;
  iconColor: string;
}

export interface FeatureItem {
  id: string;
  image: StaticImageData;
  alt: string;
  highlightedWord: string;
  restOfTitle: string;
  highlightColor: string;
  description: string;
}

export const services: readonly ServiceItem[] = [
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

export const features: readonly FeatureItem[] = [
  {
    id: "connect",
    image: ConnectWithSitters,
    alt: "Connect With Sitters",
    highlightedWord: "Connect",
    restOfTitle: "with Sitters",
    highlightColor: "text-green-500",
    description:
      "Find a verified and reviewed sitter who'll keep your pets company and give time.",
  },
  {
    id: "better",
    image: BetterForYourPets,
    alt: "Better For Your Pets",
    highlightedWord: "Better",
    restOfTitle: "For Your Pets",
    highlightColor: "text-blue-500",
    description:
      "Pets stay happy at home with a sitter who gives them loving care and companionship.",
  },
  {
    id: "calling",
    image: CallingAllPets,
    alt: "Calling All Pets",
    highlightedWord: "Calling",
    restOfTitle: "All Pets",
    highlightColor: "text-orange-500",
    description:
      "Stay for free with adorable animals in unique homes around the world.",
  },
] as const;

export { PetImage };
