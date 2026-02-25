"use client";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();
  const test = true;

  if (loading) return null;
  return (
    <nav className="font-sans">{test ? <NavbarUser /> : <NavbarGuest />}</nav>
  );
}
