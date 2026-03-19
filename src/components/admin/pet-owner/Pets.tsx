import InformationContainer from "@/components/ui/InformationContainer";
import { OwnerProfileResponse } from "@/types/admin";
import { format } from "date-fns";
import { PawPrint, X } from "lucide-react";

const showPetModal = (index: number) => {
  const dialog = document.getElementById(
    `pet-detail-${index}`,
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

function Pets({ owner }: { owner: OwnerProfileResponse }) {
  return owner.pets.length ? (
    <>
      <div>
        <ul>
          {owner.pets.map((pet, index) => (
            <div onClick={() => showPetModal(index)}>{pet.petName}</div>
          ))}
        </ul>
      </div>
      {owner.pets.map((pet, index) => (
        <dialog id={`pet-detail-${index}`} className="modal">
          <div className="modal-box w-[calc(100%-2rem)] max-w-200 bg-white rounded-2xl p-0">
            <div className="relative flex justify-between items-center px-6 py-4 border-b border-gray-300 md:px-10 md:py-6">
              <h3 className="style-headline-3 text-black">{pet.petName}</h3>
              <form method="dialog" className="h-fit">
                <button className="btn btn-sm btn-circle btn-ghost h-fit md:right-4 md:top-3">
                  <X className="size-5.5 text-gray-300" />
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-4 overflow-y-scroll h-[528px] p-4 lg:p-10 lg:flex-row lg:gap-10">
              <div className="flex flex-col items-center gap-2 w-30 md:w-60">
                {pet.imgUrl ? (
                  <div className="avatar">
                    <div className="size-30 rounded-full md:size-60">
                      <img src={pet.imgUrl} alt={pet.petName} />
                    </div>
                  </div>
                ) : (
                  <div className="avatar avatar-placeholder">
                    <div className="size-30 bg-gray-200 rounded-full md:size-60">
                      <PawPrint className="size-10 text-white -rotate-45 md:size-26" />
                    </div>
                  </div>
                )}
                <h4 className="style-headline-4 text-black text-center">
                  {pet.petName}
                </h4>
              </div>
              <div className="flex flex-col gap-4 flex-1 lg:gap-10 lg:p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
                  <InformationContainer title="Pet Type" detail={pet.petType} />
                  <InformationContainer title="Breed" detail={pet.breed} />
                  <InformationContainer title="Sex" detail={pet.sex} />
                  <InformationContainer
                    title="Date Of Birth"
                    detail={format(pet.dateOfBirth!, "dd MMM yyyy")}
                  />
                  <InformationContainer title="Color" detail={pet.color} />
                  <InformationContainer
                    title="Weight"
                    detail={`${pet.weight} Kilogram`}
                  />
                </div>
                <InformationContainer
                  title="About"
                  detail={pet.about || "No data"}
                />
              </div>
            </div>
          </div>
        </dialog>
      ))}
    </>
  ) : (
    <div className="flex flex-col gap-4 items-center justify-center h-100">
      <PawPrint className="size-10 text-gray-600 -rotate-45" />
      <h4 className="style-headline-4 text-gray-500">This owner has no pets</h4>
    </div>
  );
}

export default Pets;
