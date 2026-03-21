"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarItem, SidebarRole } from "@/types/sidebarType";
import { twMerge } from "tailwind-merge";

type SidebarProps = {
  items?: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  role?: SidebarRole;
};

export const roleStyles = {
  user: {
    base: "bg-white text-gray-600 lg:pb-6",
    activeBg: "bg-orange-100",
    activeText: "text-orange-500",
  },
  petsitter: {
    base: "bg-bg-gray text-gray-600 lg:h-screen border-r border-gray-200 lg:sticky lg:top-0",
    activeBg: "bg-orange-100",
    activeText: "text-orange-500",
  },
  admin: {
    base: "bg-black text-gray-300 lg:h-screen lg:sticky lg:top-0",
    activeBg: "bg-gray-600",
    activeText: "text-white",
  },
};

export default function Sidebar({
  items = [],
  header,
  footer,
  className = "",
  role = "user",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={twMerge(
        `lg:w-72 lg:shrink-0 lg:grid lg:grid-rows-[auto_1fr_auto] ${roleStyles[role].base}`,
        className,
      )}
    >
      {/* Header */}
      <div className="hidden lg:block lg:pt-6 lg:px-6">{header}</div>

      {/* Nav + mobile footer */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide">
        <nav className={`flex flex-row lg:flex-col style-body-1`}>
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group shrink-0
                  flex items-center justify-center lg:justify-start
                  gap-3
                  px-6 py-3 lg:px-6 lg:py-5
                  whitespace-nowrap
                  transition-colors
                  ${
                    role === "admin"
                      ? isActive
                        ? roleStyles[role].activeBg
                        : "hover:bg-gray-600"
                      : isActive
                        ? roleStyles[role].activeBg
                        : ""
                  }
                `}
              >
                <span
                  className={` transition-colors ${
                    role === "admin"
                      ? isActive
                        ? roleStyles[role].activeText
                        : "text-white group-hover:text-orange-500"
                      : isActive
                        ? roleStyles[role].activeText
                        : "text-gray-300 group-hover:text-orange-500"
                  }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`flex flex-row items-center justify-center gap-1 transition-colors ${
                    role === "admin"
                      ? isActive
                        ? roleStyles[role].activeText
                        : "text-white group-hover:text-orange-500"
                      : isActive
                        ? roleStyles[role].activeText
                        : "text-gray-500 group-hover:text-orange-500"
                  }`}
                >
                  {item.label}
                  {item.indicator}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer inline on mobile */}
        <div className="flex items-center lg:hidden shrink-0">{footer}</div>
      </div>

      {/* Footer pinned to bottom on desktop */}
      <div className="hidden lg:block w-full">{footer}</div>
    </aside>
  );
}
