"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "@/types/sidebarType";

type SidebarProps = {
  items?: SidebarItem[];
  variant?: "light" | "dark";
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function Sidebar({
  items = [],
  variant = "light",
  header,
  footer,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`lg:w-72 flex flex-col justify-between ${
        variant === "dark" ? "bg-black text-white" : "bg-white text-gray-600"
      } ${className}`}
    >
      <div className="lg:py-6 py-0 flex flex-col">
        <div className="hidden lg:block">{header}</div>

        <nav className="w-full flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible cursor-grab active:cursor-grabbing whitespace-nowrap lg:whitespace-normal scrollbar-hide style-body-1 snap-x snap-mandatory">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`snap-start group flex shrink-0 lg:px-6 px-7 lg:py-5 py-3 gap-3 items-center justify-center lg:justify-start transition-colors min-w-max ${
                  variant === "dark"
                    ? isActive
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                    : isActive
                      ? "bg-orange-100"
                      : ""
                }`}
              >
                {/* ICON */}
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-orange-500"
                      : "text-gray-300 group-hover:text-orange-500"
                  }`}
                >
                  {item.icon}
                </span>

                {/* LABEL */}
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-orange-500"
                      : "text-gray-500 group-hover:text-orange-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:block">{footer}</div>
    </aside>
  );
}
