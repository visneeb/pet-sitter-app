import { SidebarConfig } from "@/types/sidebarType";
import { UserRound, Calendar, CreditCard } from "lucide-react";
import ListIcon from "@/assets/icons/profile/list";

export const petsitterSidebarItems: SidebarConfig = [
  {
    label: "Pet Sitter Profile",
    href: "/petsitter-profile",
    icon: <UserRound />,
  },
  {
    label: "Bookings List",
    href: "/bookings",
    icon: <ListIcon />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <Calendar />,
  },
  {
    label: "Payout Options",
    href: "/payout",
    icon: <CreditCard />,
  },
];
