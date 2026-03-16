"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/web-logo.svg";
import { NavigationButton } from "@/components/ui/Button";
import { Menu } from "lucide-react";
import { closeNavbar } from "@/hooks/navbar/useCloseNavbar";

export default function NavbarGuest() {
  const pathname = usePathname();
  const loginHref =
    pathname && pathname !== "/auth/login"
      ? `/auth/login?redirect=${encodeURIComponent(pathname)}`
      : "/auth/login";

  return (
    <div className="relative flex items-center justify-between bg-white w-full px-[20px] style-body-2 lg:h-[80px] lg:px-[80px]">
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
      <div className="flex items-center gap-[12px]">
        <div className="hidden lg:flex items-center">
          <div className="px-[24px] py-[16px] style-body-1 text-black">
            <Link href="auth/register">Become a Pet Sitter</Link>
          </div>
          <div className="px-[24px] py-[16px] style-body-1 text-black">
            <Link href={loginHref}>Login</Link>
          </div>
        </div>

        <div className="drawer lg:hidden">
          <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-1"
              className="drawer-button text-gray-300 flex items-center gap-3 py-3 rounded-xl w-full cursor-pointer"
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
              <li>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <span className="text-black style-body-1">
                    Become a Pet Sitter
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <span className="text-black style-body-1">Login</span>
                </Link>
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

        <div className="hidden lg:block">
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
