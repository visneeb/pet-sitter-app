import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

export default function Navbar() {
  const result = false; //for test

  return (
    <>
      <nav className="font-sans">
        {result ? <NavbarUser /> : <NavbarGuest />}
      </nav>
    </>
  );
}
