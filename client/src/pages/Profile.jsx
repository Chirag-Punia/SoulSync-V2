import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  Switch,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useState, useEffect, use } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await userService.getUserProfileData();
        setProfile((prevProfile) => ({
          ...prevProfile,
          name: userData.displayName || prevProfile.name,
          email: userData.email || prevProfile.email,
          notifications: userData.preferences?.notifications ?? false,
          shareData: userData.preferences?.shareData ?? false,
          isAnonymous: userData.isAnonymous,
          connectedAccounts: {
            google: userData.connectedAccounts?.google || false,
            facebook: userData.connectedAccounts?.facebook || false,
            twitter: userData.connectedAccounts?.twitter || false,
          },
        }));
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfileData();
  }, []);
  const handleUpdatePreferences = async (field) => {
    let updatedPreferences;

    switch (field) {
      case "notifications":
        updatedPreferences = {
          notifications: !profile.notifications,
          shareData: profile.shareData,
          darkMode: isDark,
        };
        break;
      case "shareData":
        updatedPreferences = {
          notifications: profile.notifications,
          shareData: !profile.shareData,
          darkMode: isDark,
        };
        break;
      case "darkMode":
        updatedPreferences = {
          notifications: profile.notifications,
          shareData: profile.shareData,
          darkMode: !isDark,
        };
        break;
      default:
        return;
    }

    try {
      await userService.updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };
  const getAccountButtonStyle = (account) => {
    const buttonStyles = {
      google:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-4 focus:ring-red-300",
      facebook:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
      twitter:
        "bg-sky-400 text-white hover:bg-sky-500 focus:ring-4 focus:ring-sky-300",
    };
    return buttonStyles[account];
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

    try {
      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;

      await userService.connectAccount(provider);

      setProfile((prev) => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          [provider]: true,
        },
      }));
    } catch (error) {
      console.error("Error during social login:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
        Profile Settings
      </h1>

      <Card className="mb-6">
        <CardBody className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar src="https://i.pravatar.cc/150" className="w-24 h-24" />
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <Input
                label="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              <div className="flex justify-end space-x-2">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <Button color="primary" onPress={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardBody>
          <h3 className="text-xl font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Stay Anonymous</p>
                <p className="text-sm text-gray-500">
                  Hide your name in community posts
                </p>
              </div>
              <Switch
                isSelected={profile.isAnonymous}
                onValueChange={toggleAnonymous}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive alerts and reminders
                </p>
              </div>
              <Switch
                isSelected={profile.notifications}
                onChange={async (e) => {
                  const updatedValue = !profile.notifications;
                  setProfile((prev) => ({
                    ...prev,
                    notifications: updatedValue,
                  }));
                  await handleUpdatePreferences("notifications");
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
              <Switch
                isSelected={isDark}
                onValueChange={async () => {
                  toggleTheme();
                  await handleUpdatePreferences("darkMode");
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Share Anonymous Data</p>
                <p className="text-sm text-gray-500">
                  Help improve our services
                </p>
              </div>
              <Switch
                isSelected={profile.shareData}
                onChange={async (e) => {
                  const updatedValue = !profile.shareData;
                  setProfile((prev) => ({
                    ...prev,
                    shareData: updatedValue,
                  }));
                  await handleUpdatePreferences("shareData");
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-xl font-semibold mb-4">Connected Accounts</h3>
          <div className="space-y-4">
            {["google", "facebook", "twitter"].map((account) => (
              <div
                key={account}
                className="flex justify-between items-center p-4 rounded-lg shadow-md"
              >
                <p className="font-semibold capitalize">{account}</p>
                <Button
                  color={
                    profile.connectedAccounts[account] ? "success" : "primary"
                  }
                  onPress={(e) => {
                    if (profile.connectedAccounts[account]) {
                      e.preventDefault();
                      return;
                    }
                    handleConnectAccount(account);
                  }}
                  disabled={profile.connectedAccounts[account]}
                  className={`ml-4 ${getAccountButtonStyle(account)} ${
                    profile.connectedAccounts[account]
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {profile.connectedAccounts[account]
                    ? "Connected"
                    : `Connect ${account}`}
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-xl font-semibold mb-4">Privacy & Security</h3>
          <div className="space-y-4">
            <Button
              onPress={() => {
                signOut(auth);
                navigator("/");
              }}
              variant="light"
              className="w-full"
            >
              Log Out
            </Button>
            <Button
              color="danger"
              variant="light"
              className="w-full"
              onPress={handleDeleteAccount}
              isLoading={isLoading}
            >
              Delete Account
            </Button>
            <Button
              color="primary"
              variant="light"
              className="w-full"
              onPress={handleExportData}
            >
              Export My Data
            </Button>
            <Button
              color="warning"
              variant="light"
              className="w-full"
              onPress={handleResetPassword}
            >
              Reset Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
