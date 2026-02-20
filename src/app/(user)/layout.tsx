import Sidebar from "@/components/ui/Sidebar";
import { ownerSidebarItems } from "@/config/sidebar/owner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen bg-bg-gray text-gray-900 style-body-1">
      <div className="flex flex-col lg:flex-row pt-10 lg:gap-8 lg:px-20">
        <div className="lg:h-full">
          <Sidebar
            items={ownerSidebarItems}
            header={<h4 className="style-headline-4 pb-3 px-5">Account</h4>}
            variant="light"
            className="rounded-lg"
            /* add drop shadow */
          />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
