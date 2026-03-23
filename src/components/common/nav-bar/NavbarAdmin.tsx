"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/web-logo.svg";
import { NavigationButton } from "@/components/ui/Button";
import { User, LogOut, PawPrint, Menu, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileImg } from "@/hooks/image/useProfileImg";
import { closeNavbar } from "@/hooks/navbar/useCloseNavbar";
import { CopyIcon } from "@/assets/icons/components";

export default function NavbarAdmin() {
  const { signOut } = useAuth();
  const { profile, loading } = useProfileImg();

  const handleLogout = async () => {
    closeNavbar();
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative flex items-center justify-between bg-white w-full px-[20px] py-[12px] style-body-2 lg:h-[80px] lg:px-[80px]">
      <div>
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="h-6 w-auto md:h-10"
            loading="eager"
            priority
          />
        </Link>
      </div>
      <div className="flex items-center gap-6 md:gap-3 text-headline-1">
        <div className="dropdown dropdown-end hidden md:block">
          <div tabIndex={0} role="button" className="avatar cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200 transition overflow-hidden">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
              ) : profile?.profileImgUrl ? (
                <Image
                  src={profile.profileImgUrl}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="w-6 h-6" />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-white rounded-2xl shadow-lg z-50 w-56 p-2 mt-2"
          >
            <li>
              <Link
                href="/admin/pet-owner"
                onClick={closeNavbar}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <User className="text-gray-600" />
                <span className="text-black style-body-2">Pet Owner</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pet-sitter"
                onClick={closeNavbar}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <PawPrint className="text-gray-600 -rotate-45" />
                <span className="text-black style-body-2">Pet Sitter</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reports"
                onClick={closeNavbar}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <CopyIcon className="text-gray-600" />
                <span className="text-black style-body-2">Reports</span>
              </Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl w-full cursor-pointer"
              >
                <LogOut className="text-gray-600" />
                <span className="text-black style-body-2">Log Out</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="drawer md:hidden">
          <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-1"
              className="drawer-button text-gray-600 flex items-center gap-3  cursor-pointer"
            >
              <Menu size={24} strokeWidth={2} />
            </label>
          </div>
          <div className="drawer-side top-12">
            <label
              htmlFor="my-drawer-1"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="gap-[16px] px-[16px] py-[40px] menu bg-white h-full w-full p-4 ">
              <li>
                <Link
                  href="/admin/pet-owner"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <UserRound className="w-5 h-5 text-gray-600" />
                  <span className="text-black style-body-2">Pet Owner</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pet-sitter"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <PawPrint className="w-5 h-5 text-gray-600 -rotate-45" />
                  <span className="text-black style-body-2">Pet Sitter</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <CopyIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-black style-body-2">Reports</span>
                </Link>
              </li>
              <div className="border-t border-gray-200 my-1"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl w-full"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="text-black style-body-2">Log out</span>
                </button>
              </li>
              <li className="w-full block" onClick={closeNavbar}>
                <NavigationButton
                  variant="primary"
                  href="/search"
                  className="w-full"
                >
                  Find A Pet Sitter
                </NavigationButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden md:block" onClick={closeNavbar}>
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
