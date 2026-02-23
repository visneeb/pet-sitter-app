import Sidebar from "@/components/ui/Sidebar";
import { petsitterSidebarItems } from "@/config/sidebar/petsitter";

export default function PetSitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 style-body-1">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <Sidebar
          items={petsitterSidebarItems}
          header={<h4 className="style-headline-4 pb-3 px-5">Sitter logo</h4>}
          role="petsitter"
          footer={
            <div className="p-5">
              Log Out
            </div> /* TODO: Add logout functionality LogoutButton.tsx*/
          }
        />

        <main className="flex-1 lg:pt-10">{children}</main>
      </div>
    </div>
  );
}
