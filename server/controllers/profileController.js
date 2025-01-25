import * as UserService from "../services/profileService.js";

export const saveUser = async (req, res) => {
  try {
    const { email, displayName, photoURL, providerData } = req.body;
    await UserService.saveUser(email, displayName, photoURL, providerData);
    res.status(200).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id;
    const userProfile = await UserService.getUserProfile(firebaseUid);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const firebaseUid = req.user.user_id;
    await UserService.updateProfile(firebaseUid, name, email);
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleAnonymous = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id;
    const { isAnonymous } = req.body;
    const updatedUser = await UserService.toggleAnonymous(
      firebaseUid,
      isAnonymous
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Anonymous mode updated successfully",
      isAnonymous: updatedUser.isAnonymous,
    });
  } catch (error) {
    console.error("Error toggling anonymous mode:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { notifications, shareData, darkMode } = req.body;
    const firebaseUid = req.user.user_id;
    await UserService.updatePreferences(firebaseUid, {
      notifications,
      shareData,
      darkMode,
    });
    return res
      .status(200)
      .json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const connectAccount = async (req, res) => {
  const { provider, status } = req.body;

  if (!["google", "facebook", "twitter"].includes(provider)) {
    return res.status(400).json({ message: "Invalid provider" });
  }

  try {
    await UserService.connectAccount(req.user.user_id, provider, status);
    return res
      .status(200)
      .json({ message: `${provider} account connection updated` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
