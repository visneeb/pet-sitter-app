"use client";

import { ActionButton } from "../Button";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/assets/icons/components";
import { SidebarRole } from "@/types/sidebarType";

export function SidebarLogout({ role }: { role: SidebarRole }) {
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push("/");
  };

  return (
    <div className="lg:pb-4">
      <div
        className={`border-t ${role === "admin" ? "border-gray-500" : "border-gray-200"} hidden lg:block`}
      ></div>
      <ActionButton
        variant="ghost"
        className={`${role === "admin" ? "text-white " : "text-gray-500 h"} gap-3 lg:px-6 px-7 lg:py-4 w-full justify-start`}
        onClick={handleLogout}
      >
        <div
          className={`flex items-center gap-3 ${role === "admin" ? "text-white hover:text-orange-500" : "text-gray-500 hover:text-orange-500"}`}
        >
          <LogoutIcon />
          <span className="style-body-2">Log Out</span>
        </div>
      </ActionButton>
    </div>
  );
}
