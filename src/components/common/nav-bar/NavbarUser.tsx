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
import { useScreenContext } from "@/contexts/ScreenContext";

export default function NavbarUser() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { isMedium } = useScreenContext();
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <div
      className={`relative flex items-center justify-between bg-white w-full px-[20px] style-body-2 ${
        isMedium ? "h-[80px] px-[80px]" : ""
      }`}
    >
      <div>
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className={isMedium ? "h-[40px] w-auto" : "h-[24px] w-auto"}
          />
        </Link>
      </div>
      <div className="flex items-center gap-[12px] text-headline-1">
        <div>
          <Link
            href="/notification"
            className={`flex items-center justify-center w-12 h-12 transition ${
              isMedium
                ? "bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200"
                : "text-gray-400"
            }`}
          >
            <Bell className="w-6 h-6" />
          </Link>
        </div>
        <div>
          <Link
            href="/message"
            className={`flex items-center justify-center w-12 h-12 transition ${
              isMedium
                ? "bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200"
                : "text-gray-400"
            }`}
          >
            <MessagesSquare className="w-6 h-6" />
          </Link>
        </div>
        {isMedium && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12  bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200 transition">
                <UserRound className="w-6 h-6" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-white rounded-2xl shadow-lg z-50 w-56 p-2 mt-2"
            >
              <li>
                <Link
                  href="/user-profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <User className="text-gray-600" />
                  <span className="text-black style-body-2">Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pets"
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
        )}
        {!isMedium && (
          <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer-1"
                className="drawer-button text-gray-600 flex items-center gap-3 px-4 py-3 hover:bg-gray-200 rounded-xl w-full cursor-pointer"
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
        )}
        {isMedium && (
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        )}
      </div>
    </div>
  );
}
