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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { auth } from "../services/firebaseConfig";
import { motion } from "framer-motion";
import {
  FaHome,
  FaComments,
  FaUsers,
  FaBookOpen,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome className="text-xl" />,
    },
    { name: "Chat", path: "/chat", icon: <FaComments className="text-xl" /> },
    {
      name: "Community",
      path: "/community",
      icon: <FaUsers className="text-xl" />,
    },
    {
      name: "Resources",
      path: "/resources",
      icon: <FaBookOpen className="text-xl" />,
    },
    { name: "Profile", path: "/profile", icon: <FaUser className="text-xl" /> },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <NextUINavbar
      className={`transition-all duration-300 ${
        scrolled
          ? "bg-background/60 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent"
      }`}
      maxWidth="2xl"
      position="sticky"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="../vite.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-gradient-to-r from-purple-500 to-pink-500"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            SoulSync
          </motion.span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated ? (
          menuItems.map((item, index) => (
            <NavbarItem key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-white border border-white/10"
                  variant="flat"
                  startContent={item.icon}
                  onPress={() => navigate(item.path)}
                >
                  {item.name}
                </Button>
              </motion.div>
            </NavbarItem>
          ))
        ) : (
          <NavbarItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
                variant="shadow"
                onPress={() => navigate("/login")}
              >
                Login
              </Button>
            </motion.div>
          </NavbarItem>
        )}
      </NavbarContent>

      {isAuthenticated && (
        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                color="secondary"
                name="User"
                size="sm"
                src="https://api.dicebear.com/6.x/initials/svg?seed=User"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">User</p>
              </DropdownItem>
              {menuItems.map((item, index) => (
                <DropdownItem
                  key={index}
                  startContent={item.icon}
                  onPress={() => navigate(item.path)}
                >
                  {item.name}
                </DropdownItem>
              ))}
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<FaSignOutAlt />}
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}

      <NavbarMenu className="bg-background/95 backdrop-blur-md pt-6">
        {isAuthenticated ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <Avatar
                color="secondary"
                name="User"
                size="lg"
                src="https://api.dicebear.com/6.x/initials/svg?seed=User"
                className="w-20 h-20 text-large mb-2"
              />
              <p className="text-white font-semibold">User</p>
            </div>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={index} className="my-1">
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-white"
                  startContent={item.icon}
                  variant="flat"
                  onPress={() => {
                    setIsMenuOpen(false);
                    navigate(item.path);
                  }}
                >
                  {item.name}
                </Button>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem className="my-1">
              <Button
                fullWidth
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                startContent={<FaSignOutAlt />}
                variant="flat"
                onPress={handleLogout}
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Button
              fullWidth
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
              variant="shadow"
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
