import ProfileEdit from "@/components/owner/ownerProfileEdit";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";

export default function UserProfilePage() {
  return (
    <>
      <UserProfileHeader title="Profile" />
      <ProfileEdit />
    </>
  );
}
