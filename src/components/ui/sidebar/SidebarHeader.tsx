import logoWhite from "@/assets/logo.svg";
import webLogo from "@/assets/web-logo.svg";
import Link from "next/link";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { SidebarRole } from "@/types/sidebarType";

type SidebarHeaderProps = {
  role: SidebarRole;
  className?: string;
};

const logoByRole: Partial<Record<SidebarRole, StaticImageData>> = {
  petsitter: webLogo,
  admin: logoWhite,
};

const headerByRole: Partial<Record<SidebarRole, string>> = {
  admin: "Admin Panel",
};

const variantByRole: Partial<Record<SidebarRole, string>> = {
  admin: "pt-10",
};

export function SidebarHeader({ role, className }: SidebarHeaderProps) {
  const logo = logoByRole[role];
  const header = headerByRole[role];

  return (
    <div
      className={`flex flex-col justify-center pt-6 pb-10 ${variantByRole[role] ?? ""} ${className ?? ""}`}
    >
      {logo && (
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={128}
            height={128}
            loading="eager"
            priority
          />
        </Link>
      )}
      {header && <h4 className="style-body-2 italic">{header}</h4>}
    </div>
  );
}
