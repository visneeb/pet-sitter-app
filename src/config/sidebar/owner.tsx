import { SidebarConfig } from "@/types/sidebarType";
import { UserRound } from "lucide-react";
import PawIcon from "@/assets/icons/profile/paw-icon";
import ListIcon from "@/assets/icons/profile/list";

export const ownerSidebarItems: SidebarConfig = [
  {
    label: "Profile",
    href: "/owner-profile",
    icon: <UserRound />,
  },
  {
    label: "Your Pet",
    href: "/your-pet",
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
