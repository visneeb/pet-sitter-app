import PetListPage from "@/pages/dashboard/owner/pet/PetListPage";
import { ActionButton } from "@/components/ui/Button";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";

export default function UserProfilePage() {
//   const handleCreatePet = () => {
      
//   };

  return (
    <>
      <UserProfileHeader
        title="Your Pets"
        action={<Link href="/pets/create"><ActionButton variant="primary" >Create Pet</ActionButton></Link>}
      />
      <PetListPage />
    </>
  );
}
