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
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  return (
    <div className="relative flex items-center justify-between bg-white w-full md:h-[80px] px-[20px] py-[12px] md:px-[80px] style-body-2">
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
            className="flex items-center justify-center w-12 h-12 md:bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200"
          >
            <Bell className="md:w-6 h-6" />
          </Link>
        </div>
        <div>
          <Link
            href="/message"
            className="flex items-center justify-center w-12 h-12 md:bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200"
          >
            <MessagesSquare className="w-6 h-6" />
          </Link>
        </div>
        <div className="hidden md:block dropdown dropdown-end p-[4px]">
          <div tabIndex={0} role="button" className="avatar cursor-pointer">
            <Link
              href="/profile"
              className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200"
            >
              X
            </Link>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-white rounded-2xl shadow-lg z-50 w-56 p-2 mt-2"
          >
            <li>
              <a
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <User className="text-gray-600" />
                <span className="text-black">Profile</span>
              </a>
            </li>
            <li>
              <a
                href="/my-pet"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <PawPrint className="text-gray-600" />
                <span className="text-black">Your Pet</span>
              </a>
            </li>
            <li>
              <a
                href="/booking-history"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <History className="text-gray-600" />
                <span className="text-black">Booking History</span>
              </a>
            </li>

            <div className="divider my-1"></div>

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl w-full cursor-pointer"
              >
                <LogOut className="text-gray-600" />
                <span className="text-black">Log Out</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-500 transition p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </button>
        </div>
        {isMenuOpen && (
          <ul className="md:hidden absolute top-full right-4 mt-2 bg-white rounded-2xl shadow-lg z-50 w-56 p-2">
            <li>
              <a
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <User className="text-gray-600" />
                <span className="text-black">Profile</span>
              </a>
            </li>
            <li>
              <a
                href="/my-pet"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <PawPrint className="text-gray-600" />
                <span className="text-black">Your Pet</span>
              </a>
            </li>
            <li>
              <a
                href="/booking-history"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
              >
                <History className="text-gray-600" />
                <span className="text-black">Booking History</span>
              </a>
            </li>

            <div className="divider my-1"></div>

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl w-full cursor-pointer"
              >
                <LogOut className="text-gray-600" />
                <span className="text-black">Log Out</span>
              </button>
            </li>
          </ul>
        )}
        <div className="hidden md:block">
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
