import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

export default function Navbar() {
  const result = true;

  return (
    <>
      <nav className="font-sans">
        {result ? <NavbarUser /> : <NavbarGuest />}
      </nav>
    </>
  );
}
