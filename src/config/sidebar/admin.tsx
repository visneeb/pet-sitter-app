import { SidebarConfig } from "@/types/sidebarType";
import {UserIcon, CopyIcon} from "@/assets/icons/components/index"
import PawIcon from "@/assets/icons/profile/paw-icon";

export const adminSidebarItems: SidebarConfig = [
  {
    label: "Pet Owner",
    href: "/pet-owner",
    icon: <UserIcon/>,
  },
  {
    label: "Pet Sitter",
    href: "/pet-sitter",
    icon: <PawIcon />,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <CopyIcon/>,
    },
];
