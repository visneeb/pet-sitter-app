import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/web-logo.png";
import { NavigationButton } from "@/components/ui/Button";

export default function NavbarGuest() {
  return (
    <div className="flex items-center justify-between bg-white h-[80px] px-[80px]">
      <div>
        <Link href="/">
          <Image src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="flex items-center gap-[16px] style-body-1">
        <div className="px-[24px] py-[16px] text-black">
          <Link href="/register-pet-sitter">Become a Pet Sitter</Link>
        </div>
        <div className="px-[24px] py-[16px] text-black">
          <Link href="/login">Login</Link>
        </div>
        <div>
          <NavigationButton variant="primary" href="/search">
            Find A Pet Sitter
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
