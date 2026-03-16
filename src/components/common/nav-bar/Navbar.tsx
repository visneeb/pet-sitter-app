"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarPetSitterHome from "./NavbarPetSitterHome";
import NavbarUser from "./NavbarUser";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  if (!user) {
    return (
      <nav>
        <NavbarGuest />
      </nav>
    );
  }
  if (user.role === "sitter") {
    return <NavbarPetSitterHome />;
  }

  return (
    <nav className="font-sans">
      <NavbarUser />
    </nav>
  );
}
