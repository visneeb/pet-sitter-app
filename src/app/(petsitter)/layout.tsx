import Sidebar from "@/components/ui/sidebar/Sidebar";
import { petsitterSidebarItems } from "@/config/sidebar/petsitter";
import NavbarPetSitter from "@/components/common/nav-bar/NavbarPetSitter";
import { SidebarLogout } from "@/components/ui/sidebar/SidebarLogout";
import { SidebarHeader } from "@/components/ui/sidebar/SidebarHeader";

export default function PetSitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 style-body-1">
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col w-full lg:hidden">
          <NavbarPetSitter />
          <Sidebar
            items={petsitterSidebarItems}
            header={<SidebarHeader role="petsitter" />}
            role="petsitter"
            footer={<SidebarLogout role="petsitter" />}
          />
        </div>
        <Sidebar
          items={petsitterSidebarItems}
          header={<SidebarHeader role="petsitter"/>}
          role="petsitter"
          footer={<SidebarLogout role="petsitter" />}
          className="hidden"
        />
        <div className="flex flex-col w-full">
          <div className="hidden lg:block">
            <NavbarPetSitter />
          </div>
          <main className="flex-1 pt-7 lg:pt-10 lg:px-10 px-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
