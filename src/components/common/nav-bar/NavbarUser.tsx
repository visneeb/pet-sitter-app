"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/web-logo.png";
import { NavigationButton } from "@/components/ui/Button";
import {
  MessagesSquare,
  Bell,
  User,
  LogOut,
  PawPrint,
  History,
  Menu,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContextBackend";
import { useProfileImg } from "@/hooks/image/useProfileImg";

export default function NavbarUser() {
  const { signOut } = useAuth();
  const { profile } = useProfileImg();

  const closeDropdown = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleLogout = () => {
    closeDropdown();
    signOut();
  };

  return (
    <div className="relative flex items-center justify-between bg-white w-full px-[20px] style-body-2 md:h-[80px] md:px-[80px]">
      <div>
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="h-[24px] w-auto md:h-[40px]"
          />
        </Link>
      </div>
      <div className="flex items-center gap-[24px] md:gap-[12px] text-headline-1">
        <div>
          <Link
            href="/notification"
            className="flex items-center justify-center md:w-12 md:h-12 transition text-gray-400 md:bg-gray-100 md:rounded-full md:text-gray-300 md:hover:bg-gray-200"
          >
            <Bell className="w-6 h-6" />
          </Link>
        </div>
        <div>
          <Link
            href="/message"
            className="flex items-center justify-center md:w-12 md:h-12 transition text-gray-400 md:bg-gray-100 md:rounded-full md:text-gray-300 md:hover:bg-gray-200"
          >
            <MessagesSquare className="w-6 h-6" />
          </Link>
        </div>

        <div className="hidden md:block dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200 transition overflow-hidden">
              {profile?.profileImgUrl ? (
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
                href="/user-profile"
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <User className="text-gray-600" />
                <span className="text-black style-body-2">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pets"
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <PawPrint className="text-gray-600" />
                <span className="text-black style-body-2">Your Pet</span>
              </Link>
            </li>
            <li>
              <Link
                href="/booking-history"
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <History className="text-gray-600" />
                <span className="text-black style-body-2">History</span>
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
              className="drawer-button text-gray-600 flex items-center gap-3 py-3 hover:bg-gray-200 rounded-xl cursor-pointer"
            >
              <Menu size={24} strokeWidth={2} />
            </label>
          </div>
          <div className="drawer-side top-[48px]">
            <label
              htmlFor="my-drawer-1"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="gap-[16px] px-[16px] py-[40px] menu bg-white h-full w-full p-4 ">
              <li className="text-black style-body-1 hover:bg-gray-50">
                <Link href="/profile">
                  <UserRound />
                  Profile
                </Link>
              </li>
              <li className="text-black style-body-1 hover:bg-gray-50">
                <Link href="/my-pet">
                  <PawPrint />
                  Your Pet
                </Link>
              </li>
              <li className="text-black style-body-1 hover:bg-gray-50">
                <Link href="/booking-history">
                  <History />
                  Booking History
                </Link>
              </li>
              <div className="border-t border-gray-200  my-1"></div>
              <li className="text-black style-body-1 hover:bg-gray-50">
                <button onClick={handleLogout}>
                  <LogOut />
                  Log out
                </button>
              </li>
              <li className="w-full block">
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

        <div className="hidden md:block">
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
