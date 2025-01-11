import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  Switch,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
} from "../services/firebaseConfig";
import {
  getAuth,
  updateProfile,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function Profile() {
  const navigator = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    notifications: true,
    shareData: true,
    connectedAccounts: {
      google: false,
      facebook: false,
      twitter: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || "John Doe",
        email: user.email || "No email",
        connectedAccounts: {
          google: user.providerData.some(
            (provider) => provider.providerId === "google.com"
          ),
          facebook: user.providerData.some(
            (provider) => provider.providerId === "facebook.com"
          ),
          twitter: user.providerData.some(
            (provider) => provider.providerId === "twitter.com"
          ),
        },
      }));
    }
  }, []);

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

  const handleConnectAccount = async (account) => {
    try {
      let provider;
      switch (account) {
        case "google":
          provider = googleProvider;
          break;
        case "facebook":
          provider = facebookProvider;
          break;
        case "twitter":
          provider = twitterProvider;
          break;
        default:
          break;
      }

      if (provider) {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        setProfile((prev) => ({
          ...prev,
          connectedAccounts: {
            ...prev.connectedAccounts,
            [account]: user.providerData.some(
              (provider) => provider.providerId === `${account}.com`
            ),
          },
        }));
      }
    } catch (error) {
      console.error(`${account} connection error:`, error);
    }
  };

  const handleSave = async () => {
    if (profile.name !== "" && profile.email !== "") {
      try {
        await updateProfile(auth.currentUser, {
          displayName: profile.name,
          email: profile.email,
        });

        setIsEditing(false);
      } catch (error) {
        console.error("Error saving profile: ", error);
      }
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
                <p className="font-semibold">Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive alerts and reminders
                </p>
              </div>
              <Switch
                checked={profile.notifications}
                onChange={(e) =>
                  setProfile({ ...profile, notifications: e.target.checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Theme</p>
                <p className="text-sm text-gray-500">Toggle theme</p>
              </div>
              <Switch checked={isDark} onChange={toggleTheme} />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Share Anonymous Data</p>
                <p className="text-sm text-gray-500">
                  Help improve our services
                </p>
              </div>
              <Switch
                checked={profile.shareData}
                onChange={(e) =>
                  setProfile({ ...profile, shareData: e.target.checked })
                }
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
            <Button color="danger" variant="light" className="w-full">
              Delete Account
            </Button>
            <Button color="primary" variant="light" className="w-full">
              Export My Data
            </Button>
            <Button color="warning" variant="light" className="w-full">
              Reset Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
