import Sidebar from "@/components/ui/sidebar/Sidebar";
import { adminSidebarItems } from "@/config/sidebar/admin";
import { SidebarLogout } from "@/components/ui/sidebar/SidebarLogout";
import { SidebarHeader } from "@/components/ui/sidebar/SidebarHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 style-body-1">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar
          items={adminSidebarItems}
          header={<SidebarHeader role="admin" />}
          role="admin"
          footer={<SidebarLogout role="admin" />}
        />
        <div className="flex flex-col flex-1 w-full">
          <main className="flex-1 lg:pt-10 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
