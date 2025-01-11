import { Card, CardBody, Input, Button, Avatar, Switch } from "@nextui-org/react";
import { useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    notifications: true,
    darkMode: false,
    language: "English",
    shareData: true
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Profile Settings</h1>

      <Card className="mb-6">
        <CardBody className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar 
              src="https://i.pravatar.cc/150" 
              className="w-24 h-24"
            />
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
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button color="danger" variant="light" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button color="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <Button color="primary" onClick={() => setIsEditing(true)}>
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
                <p className="text-sm text-gray-500">Receive alerts and reminders</p>
              </div>
              <Switch
                checked={profile.notifications}
                onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
              <Switch
                checked={profile.darkMode}
                onChange={(e) => setProfile({ ...profile, darkMode: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Share Anonymous Data</p>
                <p className="text-sm text-gray-500">Help improve our services</p>
              </div>
              <Switch
                checked={profile.shareData}
                onChange={(e) => setProfile({ ...profile, shareData: e.target.checked })}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-xl font-semibold mb-4">Privacy & Security</h3>
          <div className="space-y-4">
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