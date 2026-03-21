export type SidebarItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  indicator?: React.ReactNode;
};

export type SidebarConfig = SidebarItem[];

export type SidebarRole = "user" | "petsitter" | "admin";
