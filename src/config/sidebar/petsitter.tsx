import { SidebarConfig } from "@/types/sidebarType";
import { UserIcon, CalendarIcon, CreditCardIcon} from "@/assets/icons/components/index";
import ListIcon from "@/assets/icons/profile/list";

export const petsitterSidebarItems: SidebarConfig = [
  {
    label: "Pet Sitter Profile",
    href: "/petsitter-profile",
    icon: <UserIcon />,
  },
  {
    label: "Bookings List",
    href: "/bookings",
    icon: <ListIcon />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <CalendarIcon />,
  },
  {
    label: "Payout Options",
    href: "/payout",
    icon: <CreditCardIcon />,
  },
];
