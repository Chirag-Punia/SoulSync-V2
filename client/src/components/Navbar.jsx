import { Link } from 'react-router-dom';
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "Community", path: "/community" },
    { name: "Resources", path: "/resources" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="font-bold text-inherit">Mental Health Support</Link>
        </NavbarBrand>
      </NavbarContent>

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

      <NavbarContent justify="end" className="hidden sm:flex">
        <NavbarItem>
          <Link to="/profile">
            <Button color="primary" variant="flat">
              Profile
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              to={item.path}
              className="w-full text-inherit"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}

export default Navbar;