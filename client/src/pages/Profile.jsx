import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  Switch,
  Divider,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaMoon,
  FaBell,
  FaUserSecret,
  FaShareAlt,
  FaSignOutAlt,
  FaTrash,
  FaFileExport,
  FaKey,
  FaEdit,
} from "react-icons/fa";
import { getAuth, signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
} from "../services/firebaseConfig";
import { userService } from "../services/userService";
import { signOut } from "firebase/auth";

function Profile() {
  const navigator = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [urlLoading, setUrlLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    notifications: true,
    shareData: true,
    isAnonymous: false,
    connectedAccounts: {
      google: false,
      facebook: false,
      twitter: false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await userService.getUserProfileData();
        setPreferences({
          isAnonymous: userData.isAnonymous || false,
          notifications: userData.preferences?.notifications || false,
          darkMode: isDark,
          shareData: userData.preferences?.shareData || false,
        });
        setUrl(userData.photoURL);
        setUrlLoading(false);
        setProfile((prevProfile) => ({
          ...prevProfile,
          name: userData.displayName || prevProfile.name,
          email: userData.email || prevProfile.email,
          connectedAccounts: {
            google: userData.connectedAccounts?.google || false,
            facebook: userData.connectedAccounts?.facebook || false,
            twitter: userData.connectedAccounts?.twitter || false,
          },
        }));
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfileData();
  }, [isDark]);
  const handleUpdatePreferences = async (field) => {
    try {
      const updatedPreferences = {
        ...preferences,
        [field]: field === "darkMode" ? !isDark : !preferences[field],
      };
      console.log(updatedPreferences);
      await userService.updatePreferences(updatedPreferences);

      if (field !== "darkMode") {
        setPreferences(updatedPreferences);
      }

      return true;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  };
  const handleResetPassword = async () => {
    try {
      await userService.resetPassword(profile.email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Password reset failed:", error);
      alert("Failed to send password reset email.");
    }
  };
  const handleSave = async () => {
    try {
      const updatedProfile = {
        name: profile.name,
        email: profile.email,
      };

      await userService.updateProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Delete account permanently?")) {
      setIsLoading(true);
      try {
        await userService.deleteUserAccount();
        navigator("/login");
        toast.success("Account deleted successfully.");
      } catch (error) {
        console.error("Account deletion error:", error);
        toast.error(
          error.code === "auth/requires-recent-login"
            ? "Please log in again to delete your account."
            : "Failed to delete account. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const data = await userService.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "user-data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Data export error:", error);
    }
  };

  const toggleAnonymous = async () => {
    try {
      const newAnonymousStatus = !profile.isAnonymous;
      const success = await userService.toggleAnonymous(newAnonymousStatus);

      if (success) {
        setProfile((prev) => ({
          ...prev,
          isAnonymous: newAnonymousStatus,
        }));
      }
    } catch (error) {
      console.error("Error toggling anonymous mode:", error);
    }
  };

  const handleConnectAccount = async (provider) => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      let selectedProvider;

      switch (provider) {
        case "google":
          selectedProvider = googleProvider;
          break;
        case "facebook":
          selectedProvider = facebookProvider;
          break;
        case "twitter":
          selectedProvider = twitterProvider;
          break;
        default:
          return;
      }

      const result = await signInWithPopup(auth, selectedProvider);
      await userService.connectAccount(provider);

      setProfile((prev) => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          [provider]: true,
        },
      }));

      toast.success(`Successfully connected ${provider} account`);
    } catch (error) {
      console.error("Error connecting account:", error);
      toast.error(`Failed to connect ${provider} account`);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const [preferences, setPreferences] = useState({
    isAnonymous: false,
    notifications: false,
    darkMode: isDark,
    shareData: false,
  });

  const [currentUser] = useState("Chirag-Punia");
  const [currentDateTime, setCurrentDateTime] = useState("2025-01-26 17:29:37");
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8"
          variants={itemVariants}
        >
          Profile Settings
        </motion.h1>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardBody className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  {urlLoading ? (
                    <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
                  ) : (
                    <img
                      src={url || "https://i.pravatar.cc/150"}
                      alt="Profile"
                      className="w-32 h-32 text-large ring-4 ring-purple-500/50 group-hover:ring-purple-500 transition-all duration-300 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      isIconOnly
                      className="bg-purple-500/80 text-white"
                      size="sm"
                    >
                      <FaEdit />
                    </Button>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-gray-400">{profile.email}</p>
                  {!isEditing && (
                    <Button
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
                      variant="shadow"
                      onPress={() => setIsEditing(true)}
                      startContent={<FaEdit />}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <Input
                    label="Name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    classNames={{
                      input: "text-white",
                      label: "text-gray-400",
                    }}
                  />
                  <Input
                    label="Email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    classNames={{
                      input: "text-white",
                      label: "text-gray-400",
                    }}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                      variant="shadow"
                      onPress={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardBody>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Preferences
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Stay Anonymous",
                    description: "Hide your name in community posts",
                    icon: <FaUserSecret />,
                    key: "isAnonymous",
                    isSelected: preferences.isAnonymous,
                    onChange: async () => {
                      try {
                        setPreferences((prev) => ({
                          ...prev,
                          isAnonymous: !prev.isAnonymous,
                        }));
                        await toggleAnonymous(!preferences.isAnonymous);
                        toast.success("Anonymous mode updated");
                      } catch (error) {
                        setPreferences((prev) => ({
                          ...prev,
                          isAnonymous: !prev.isAnonymous,
                        }));
                        toast.error("Failed to update anonymous mode");
                      }
                    },
                  },
                  {
                    title: "Notifications",
                    description: "Receive alerts and reminders",
                    icon: <FaBell />,
                    key: "notifications",
                    isSelected: preferences.notifications,
                    onChange: async () => {
                      try {
                        setPreferences((prev) => ({
                          ...prev,
                          notifications: !prev.notifications,
                        }));
                        await handleUpdatePreferences("notifications");
                        toast.success("Notification preferences updated");
                      } catch (error) {
                        setPreferences((prev) => ({
                          ...prev,
                          notifications: !prev.notifications,
                        }));
                        toast.error(
                          "Failed to update notification preferences"
                        );
                      }
                    },
                  },
                  {
                    title: "Share Anonymous Data",
                    description: "Help improve our services",
                    icon: <FaShareAlt />,
                    key: "shareData",
                    isSelected: preferences.shareData,
                    onChange: async () => {
                      try {
                        setPreferences((prev) => ({
                          ...prev,
                          shareData: !prev.shareData,
                        }));
                        await handleUpdatePreferences("shareData");
                        toast.success("Data sharing preference updated");
                      } catch (error) {
                        setPreferences((prev) => ({
                          ...prev,
                          shareData: !prev.shareData,
                        }));
                        toast.error("Failed to update data sharing preference");
                      }
                    },
                  },
                ].map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-purple-400 text-xl">{pref.icon}</div>
                      <div>
                        <p className="font-semibold text-white">{pref.title}</p>
                        <p className="text-sm text-gray-400">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      isSelected={pref.isSelected}
                      onValueChange={pref.onChange}
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-purple-500",
                      }}
                      size="lg"
                      color="secondary"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardBody>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Connected Accounts
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "google",
                    icon: <FaGoogle />,
                    color: "from-red-500 to-yellow-500",
                  },
                  {
                    name: "facebook",
                    icon: <FaFacebook />,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "twitter",
                    icon: <FaTwitter />,
                    color: "from-blue-400 to-cyan-400",
                  },
                ].map((account) => (
                  <div
                    key={account.name}
                    className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl text-white">{account.icon}</div>
                      <p className="font-semibold text-white capitalize">
                        {account.name}
                      </p>
                    </div>
                    <Button
                      className={`bg-gradient-to-r ${account.color} ${
                        profile.connectedAccounts[account.name]
                          ? "opacity-50"
                          : ""
                      }`}
                      onPress={() => handleConnectAccount(account.name)}
                      disabled={profile.connectedAccounts[account.name]}
                    >
                      {profile.connectedAccounts[account.name]
                        ? "Connected"
                        : `Connect ${account.name}`}
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardBody>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Privacy & Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Log Out",
                    icon: <FaSignOutAlt />,
                    onClick: () => {
                      signOut(auth);
                      navigator("/");
                    },
                    class: "bg-gradient-to-r from-gray-600 to-gray-700",
                  },
                  {
                    label: "Delete Account",
                    icon: <FaTrash />,
                    onClick: handleDeleteAccount,
                    class: "bg-gradient-to-r from-red-600 to-red-700",
                  },
                  {
                    label: "Export My Data",
                    icon: <FaFileExport />,
                    onClick: handleExportData,
                    class: "bg-gradient-to-r from-green-600 to-teal-600",
                  },
                  {
                    label: "Reset Password",
                    icon: <FaKey />,
                    onClick: handleResetPassword,
                    class: "bg-gradient-to-r from-yellow-600 to-orange-600",
                  },
                ].map((action, index) => (
                  <Button
                    key={index}
                    className={`${action.class} text-white`}
                    startContent={action.icon}
                    onPress={action.onClick}
                    size="lg"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Profile;
