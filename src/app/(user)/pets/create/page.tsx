import PetListPage from "@/pages/dashboard/owner/pet/PetListPage";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreatePetPage() {
  return (
    <>
      <UserProfileHeader
        title="Your Pets"
        leftAction={
          <Link href="/pets">
            <ChevronLeft />
          </Link>
        }
      />
      {/* Pet create form*/}
    </>
  );
}
