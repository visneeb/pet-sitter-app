"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarPetSitterHome from "./NavbarPetSitterHome";
import NavbarUser from "./NavbarUser";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const NavbarComponent = !user
    ? NavbarGuest
    : user.role === "sitter"
      ? NavbarPetSitterHome
      : NavbarUser;

  return (
    <nav className="font-sans sticky top-0 z-50">
      <NavbarComponent />
    </nav>
  );
}
