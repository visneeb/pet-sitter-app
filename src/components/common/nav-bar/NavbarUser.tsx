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
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function NavbarUser() {
  const router = useRouter();
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <div className="relative flex items-center justify-between bg-white w-full md:h-[80px] px-[20px] md:px-[80px] style-body-2">
      <div>
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="h-[24px] md:h-[40px] w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center gap-[12px] text-headline-1">
        <div>
          <Link
            href="/notification"
            className="flex items-center justify-center w-12 h-12 md:bg-gray-100 md:rounded-full text-gray-400 md:text-gray-300 md:hover:bg-gray-200 transition"
          >
            <Bell className="md:w-6 h-6 " />
          </Link>
        </div>
        <div>
          <Link
            href="/message"
            className="flex items-center justify-center w-12 h-12 md:bg-gray-100 md:rounded-full text-gray-400 md:text-gray-300 md:hover:bg-gray-200 transition"
          >
            <MessagesSquare className="w-6 h-6" />
          </Link>
        </div>
        <div className="hidden md:block dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar cursor-pointer">
            <Link
              href="/profile"
              className="flex items-center justify-center w-12 h-12 md:bg-gray-100 md:rounded-full text-gray-400 md:text-gray-300 md:hover:bg-gray-200 transition"
            >
              <UserRound className="w-6 h-6" />
            </Link>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-white rounded-2xl shadow-lg z-50 w-56 p-2 mt-2"
          >
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <User className="text-gray-600" />
                <span className="text-black style-body-2">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/my-pet"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <PawPrint className="text-gray-600" />
                <span className="text-black style-body-2">Your Pet</span>
              </Link>
            </li>
            <li>
              <Link
                href="/booking-history"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <History className="text-gray-600" />
                <span className="text-black style-body-2">Booking History</span>
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
              className=" drawer-button text-gray-600 flex items-center gap-3 px-4 py-3 md:hover:bg-gray-200 rounded-xl w-full cursor-pointer"
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
        <div className="hidden md:block ">
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
