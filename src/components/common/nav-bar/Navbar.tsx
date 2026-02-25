"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) return null;
  return (
    <nav className="font-sans">{user ? <NavbarUser /> : <NavbarGuest />}</nav>
  );
}
