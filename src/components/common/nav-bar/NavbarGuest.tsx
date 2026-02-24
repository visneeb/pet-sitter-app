"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/web-logo.png";
import { NavigationButton } from "@/components/ui/Button";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function NavbarGuest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="flex items-center gap-[12px]">
        <div className="hidden md:block px-[24px] py-[16px] style-body-1 text-black ">
          <Link href="/register-pet-sitter" className="">
            Become a Pet Sitter
          </Link>
        </div>
        <div className="hidden md:block px-[24px] py-[16px] style-body-1 text-black">
          <Link href="/login">Login</Link>
        </div>
        <div className="drawer md:hidden">
          <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
          <div
            className="drawer-content"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <label
              htmlFor="my-drawer-1"
              className=" drawer-button text-gray-300 flex items-center gap-3 px-4 py-3 hover:bg-gray-200 rounded-xl w-full cursor-pointer"
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
                <Link href="/register-pet-sitter">Become a Pet Sitter</Link>
              </li>
              <li className="text-black style-body-1 hover:bg-gray-50">
                <Link href="/login">Login</Link>
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
