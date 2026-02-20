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

export default function Content() {
  const { isMedium, isLarge } = useScreenContext();

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

        <div className="flex flex-col md:flex-row  justify-between mx-auto max-w-[1064px] gap-24">
          <div className="flex flex-col gap-14 max-w-[504px]">
            <div className="flex gap-3">
              <Star className="w-6 h-6 shrink-0 text-blue-500" />
              <div className=" flex flex-col gap-3">
                <h3 className="style-headline-3">Broading</h3>
                <p className="style-body-1">
                  Your pets stay overnight in your sitter’s home. They’ll be
                  treated like part of the family in a comfortable environment.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Star className="w-6 h-6 shrink-0 text-pink-500" />
              <div className=" flex flex-col gap-3">
                <h3 className="style-headline-3">House Sitting</h3>
                <p className="style-body-1">
                  Your sitter takes care of your pets and your home. Your pets
                  will get all the attention they need without leaving home.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Star className="w-6 h-6 shrink-0 text-green-500" />
              <div className=" flex flex-col gap-3">
                <h3 className="style-headline-3">Dog Walking</h3>
                <p className="style-body-1">
                  Your dog gets a walk around your neighborhood. Perfect for
                  busy days and dogs with extra energy to burn.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Star className="w-6 h-6 shrink-0 text-yellow-500" />
              <div className=" flex flex-col gap-3">
                <h3 className="style-headline-3">Drop-In Visits</h3>
                <p className="style-body-1">
                  Your sitter drops by your home to play with your pets, offer
                  food, and give potty breaks or clean the litter box.
                </p>
              </div>
            </div>
          </div>
          <Image src={PetImage} alt="Pet Image" className="object-cover" />
        </div>

        <div className="flex flex-col md:flex-row justify-center max-w-[1280px] mx-auto gap-8">
          <div className="flex  flex-col gap-10 items-center px-6   max-w-sm 0">
            <Image
              src={ConnectWithSitters}
              alt="Connect With Sitters"
              className="w-72 h-72 object-contain rounded-full shrink-0"
            />
            <div className="flex flex-col gap-3 items-center">
              <p className="style-headline-3">
                <span className="text-green-500">Connect</span> with Sitters
              </p>
              <p className="style-body-1 text-center text-gray-500">
                Find a verified and reviewed sitter who’ll keep your pets
                company and give time.
              </p>
            </div>
          </div>

          <div className="flex  flex-col gap-10 items-center px-6   max-w-sm ">
            <Image
              src={BetterForYourPets}
              alt="Better For Your Pets"
              className="w-72 h-72 object-contain rounded-full shrink-0"
            />
            <div className="flex flex-col gap-3 items-center">
              <p className="style-headline-3">
                <span className="text-blue-500">Better</span> For Your Pets
              </p>
              <p className="style-body-1 text-center text-gray-500">
                Pets stay happy at home with a sitter who gives them loving care
                and companionship.
              </p>
            </div>
          </div>

          <div className="flex  flex-col gap-10 items-center px-6  max-w-sm ">
            <Image
              src={CallingAllPets}
              alt="Calling All Pets"
              className="w-72 h-72 object-contain rounded-full shrink-0"
            />
            <div className="flex flex-col gap-3 items-center">
              <p className="style-headline-3">
                <span className="text-orange-500">Calling</span> All Pets
              </p>
              <p className="style-body-1 text-center text-gray-500">
                Stay for free with adorable animals in unique homes around the
                world.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Perfect Pet Sitter Section */}
      <section className="relative overflow-hidden bg-yellow-100  py-20 w-fullflex flex-col items-center justify-center gap-10 md:mx-20 md:my-20 md:rounded-2xl">
        {/* Decorative shapes */}
        <HalfEllipse className="absolute bottom-0 -left-5 w-62 h-31 text-blue-500" />
        <FullEllipse className="absolute -top-15 -right-3 w-33 h-33 text-yellow-200" />
        <Star className="absolute w-28 h-27 text-green-500 right-20 top-8" />

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
                className="w-full px-8 py-3 style-button text-orange-500  rounded-full hover:underline hover:cursor-pointer transition-colors"
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
