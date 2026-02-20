import Image from "next/image";
import ConnectWithSitters from "@/assets/ContentSection/ConnectWithSitters.png";
import CallingAllPets from "@/assets/ContentSection/CallingAllPets.png";
import BetterForYourPets from "@/assets/ContentSection/BetterForYourPets.png";
import PetImage from "@/assets/ContentSection/lovely-pet-portrait-isolated 1.png";
import Star1 from "@/assets/ContentSection/StarBlue.png";
import Star2 from "@/assets/ContentSection/StarPink.png";
import Star3 from "@/assets/ContentSection/StarGreen.png";
import Star4 from "@/assets/ContentSection/StarYellow.png";
export default function Content() {
  return (
    <div className="flex flex-col gap-[120px] p-10">
      <div className="flex text-center justify-center style-headline-3">
        "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
      </div>

      <div className="flex flex-col md:flex-row  justify-between mx-auto max-w-[1064px] gap-24">
        <div className="flex flex-col gap-14 max-w-[504px]">
          <div className="flex gap-3">
            <Image src={Star1} alt="Broading" className="w-6 h-6" />
            <div className=" flex flex-col gap-3">
              <h3 className="style-headline-3">Broading</h3>
              <p className="style-body-1">
                Your pets stay overnight in your sitter’s home. They’ll be
                treated like part of the family in a comfortable environment.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Image src={Star2} alt="House Sitting" className="w-6 h-6" />
            <div className=" flex flex-col gap-3">
              <h3 className="style-headline-3">House Sitting</h3>
              <p className="style-body-1">
                Your sitter takes care of your pets and your home. Your pets
                will get all the attention they need without leaving home.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Image src={Star3} alt="Dog Walking" className="w-6 h-6" />
            <div className=" flex flex-col gap-3">
              <h3 className="style-headline-3">Dog Walking</h3>
              <p className="style-body-1">
                Your dog gets a walk around your neighborhood. Perfect for busy
                days and dogs with extra energy to burn.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Image src={Star4} alt="Drop-In Visits" className="w-6 h-6" />
            <div className=" flex flex-col gap-3">
              <h3 className="style-headline-3">Drop-In Visits</h3>
              <p className="style-body-1">
                Your sitter drops by your home to play with your pets, offer
                food, and give potty breaks or clean the litter box.
              </p>
            </div>
          </div>
        </div>
        <Image 
        src={PetImage} 
        alt="Pet Image"
        className="object-cover"
        />
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
              Find a verified and reviewed sitter who’ll keep your pets company
              and give time.
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
  );
}
