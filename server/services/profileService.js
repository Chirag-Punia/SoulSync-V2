import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const saveUser = async (email, displayName, photoURL, providerData) => {
  let user = await Profile.findOne({ email });
  if (!user) {
    user = new Profile({
      email,
      displayName,
      photoURL,
      providerData,
    });
    await user.save();
  }
};

export const getUserProfile = async (firebaseUid) => {
  const user = await User.findOne({ firebaseUid });

  if (!user) {
    return null;
  }

  return {
    displayName: user.displayName,
    email: user.email,
    isAnonymous: user.isAnonymous,
    preferences: user.preferences,
    connectedAccounts: user.connectedAccounts,
  };
};

export const updateProfile = async (firebaseUid, name, email) => {
  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new Error("User not found");
  }

  if (name) user.displayName = name;
  if (email) user.email = email;

  user.updatedAt = new Date();

  await user.save();
};

export const toggleAnonymous = async (firebaseUid, isAnonymous) => {
  return await User.findOneAndUpdate(
    { firebaseUid },
    { $set: { isAnonymous } },
    { new: true }
  );
};

export const updatePreferences = async (firebaseUid, preferences) => {
  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new Error("User not found");
  }

  const { notifications, shareData, darkMode } = preferences;

  if (notifications !== undefined)
    user.preferences.notifications = notifications;
  if (shareData !== undefined) user.preferences.shareData = shareData;
  if (darkMode !== undefined) user.preferences.darkMode = darkMode;

  user.updatedAt = new Date();

  await user.save();
};

export const connectAccount = async (firebaseUid, provider, status) => {
  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new Error("User not found");
  }

  user.connectedAccounts[provider] = status;
  user.updatedAt = new Date();

  await user.save();
};