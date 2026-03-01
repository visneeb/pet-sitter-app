import Sidebar from "@/components/ui/sidebar/Sidebar";
import { ownerSidebarItems } from "@/config/sidebar/owner";
import ProfileContainer from "@/components/profile/ProfileContainer";
import Navbar from "@/components/common/nav-bar/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-gray text-gray-900 style-body-1">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-col lg:flex-row lg:pt-10 lg:gap-8 lg:px-20">
        <div className="lg:h-full lg:sticky lg:top-16">
          <Sidebar
            items={ownerSidebarItems}
            header={<h4 className="style-headline-4 pb-3 px-5">Account</h4>}
            role="user"
            className="rounded-lg"
            /* add drop shadow */
          />
        </div>
        <main className="flex-1 lg:sticky lg:top-16">
          <ProfileContainer>{children}</ProfileContainer>
        </main>
      </div>
    </div>
  );
}
