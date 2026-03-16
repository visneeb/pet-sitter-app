import { SidebarConfig } from "@/types/sidebarType";
import {UserIcon, CopyIcon} from "@/assets/icons/components/index"
import PawIcon from "@/assets/icons/profile/paw-icon";

export const adminSidebarItems: SidebarConfig = [
  {
    label: "Pet Owner",
    href: "/admin/pet-owner",
    icon: <UserIcon/>,
  },
  {
    label: "Pet Sitter",
    href: "/admin/pet-sitter",
    icon: <PawIcon />,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: <CopyIcon/>,
    },
];
