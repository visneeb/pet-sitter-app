import { SidebarConfig } from "@/types/sidebarType";
import { UserIcon } from "@/assets/icons/components/index";
import PawIcon from "@/assets/icons/profile/paw-icon";
import ListIcon from "@/assets/icons/profile/list";

export const ownerSidebarItems: SidebarConfig = [
  {
    label: "Profile",
    href: "/user-profile",
    icon: <UserIcon />,
  },
  {
    label: "Your Pet",
    href: "/pets",
    icon: <PawIcon />,
  },
  {
    label: "Booking History",
    href: "/booking-history",
    icon: <ListIcon />,
  },
  {
    label: "Change Password",
    href: "/change-password",
    icon: <ListIcon />,
  },
];
