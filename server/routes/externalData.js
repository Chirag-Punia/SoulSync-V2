import express from "express";
import extern from "../models/ExternalData.js";
import User from "../models/User.js";
const router = express.Router();

// Route to save user data to MongoDB
router.post("/save-user", async (req, res) => {
  const { email, displayName, photoURL, providerData } = req.body;

  try {
    let user = await extern.findOne({ email });
    if (!user) {
      user = new extern({
        email,
        displayName,
        photoURL,
        providerData,
      });
      await user.save();
    }

    res.status(200).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
});
router.get("/user-profile", async (req, res) => {
  try {
    const firebaseUid = req.user.user_id;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      displayName: user.displayName,
      email: user.email,
      isAnonymous: user.isAnonymous,
      preferences: user.preferences,
      connectedAccounts: user.connectedAccounts,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-profile", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: req.user.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.displayName = name;
    if (email) user.email = email;

    user.updatedAt = new Date();

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.patch("/toggle-anonymous", async (req, res) => {
  try {
    const firebaseUid = req.user.user_id;
    const { isAnonymous } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: { isAnonymous } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Anonymous mode updated successfully",
      isAnonymous: user.isAnonymous,
    });
  } catch (error) {
    console.error("Error toggling anonymous mode:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.patch("/update-preferences", async (req, res) => {
  const { notifications, shareData, darkMode } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: req.user.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (notifications !== undefined)
      user.preferences.notifications = notifications;
    if (shareData !== undefined) user.preferences.shareData = shareData;
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;

    user.updatedAt = new Date();

    await user.save();
    return res
      .status(200)
      .json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/connect-account", async (req, res) => {
  const { provider, status } = req.body;

  if (!["google", "facebook", "twitter"].includes(provider)) {
    return res.status(400).json({ message: "Invalid provider" });
  }

  try {
    const user = await User.findOne({ firebaseUid: req.user.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.connectedAccounts[provider] = status;
    user.updatedAt = new Date();

    await user.save();
    return res
      .status(200)
      .json({ message: `${provider} account connection updated` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
