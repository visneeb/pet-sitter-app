import { SidebarConfig } from "@/types/sidebarType";
import {
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
} from "@/assets/icons/components/index";
import ListIcon from "@/assets/icons/profile/list";

export const petsitterSidebarItems: SidebarConfig = [
  {
    label: "Pet Sitter Profile",
    href: "/petsitter-profile",
    icon: <UserIcon className="w-5 h-5 text-gray-600" />,
  },
  {
    label: "Bookings List",
    href: "/bookings",
    icon: <ListIcon className="w-5 h-5 text-gray-600" />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <CalendarIcon className="w-5 h-5 text-gray-600" />,
  },
  {
    label: "Payout Options",
    href: "/payout",
    icon: <CreditCardIcon className="w-5 h-5 text-gray-600" />,
  },
];
