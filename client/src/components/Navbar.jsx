import { Link } from 'react-router-dom';
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";

function Navbar() {
  return (
    <NextUINavbar>
      <NavbarBrand>
        <Link to="/" className="font-bold text-inherit">Mental Health Support</Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/" className="text-inherit">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/chat" className="text-inherit">Chat</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/community" className="text-inherit">Community</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/resources" className="text-inherit">Resources</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link to="/profile">
            <Button color="primary" variant="flat">
              Profile
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}

export default Navbar;