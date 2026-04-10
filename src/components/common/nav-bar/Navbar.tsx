"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarPetSitterHome from "./NavbarPetSitterHome";
import NavbarUser from "./NavbarUser";
import NavbarAdmin from "./NavbarAdmin";

import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const NavbarComponent = !user
    ? NavbarGuest
    : user.role === "sitter"
    ? NavbarPetSitterHome
    : user.role === "admin"
    ? NavbarAdmin
    : NavbarUser;

  return (
    <nav className="font-sans sticky top-0 z-60">
      <NavbarComponent />
    </nav>
  );
}
