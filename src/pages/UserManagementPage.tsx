import ProfileEdit from "@/components/owner/profileEdit";

export default function UserManagementPage() {
  return (
    <div className="bg-white p-10 rounded-lg">
      <h3 className="style-headline-3">Profile</h3>
      <ProfileEdit />
    </div>
  );
}
