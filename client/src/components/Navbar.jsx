import { useNavigate } from "react-router-dom";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { auth } from "../services/firebaseConfig";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

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
        <NavbarBrand
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="../../public/vite.png" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-lg">SoulSync</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated ? (
          menuItems.map((item, index) => (
            <NavbarItem key={index}>
              <Button
                auto
                flat
                color="gradient"
                onPress={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            </NavbarItem>
          ))
        ) : (
          <NavbarItem>
            <Button
              auto
              flat
              color="primary"
              onPress={() => navigate("/login")}
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {isAuthenticated ? (
          menuItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Button
                auto
                flat
                color="gradient"
                onPress={() => {
                  setIsMenuOpen(false);
                  navigate(item.path);
                }}
              >
                {item.name}
              </Button>
            </NavbarMenuItem>
          ))
        ) : (
          <NavbarMenuItem>
            <Button
              auto
              flat
              color="primary"
              onPress={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </NextUINavbar>
  );
}

export default Navbar;
