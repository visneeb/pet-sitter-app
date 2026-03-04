"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";
import { useAuth } from "@/contexts/AuthContextBackend";

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="font-sans">{user ? <NavbarUser /> : <NavbarGuest />}</nav>
  );
}
