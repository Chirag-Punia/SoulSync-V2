import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Endpoint to save or update user details after login
router.post("/login", async (req, res) => {
  const { firebaseUid, email, displayName } = req.body;

  try {
    let user = await User.findOne({ firebaseUid });

    if (user) {
      user.email = email;
      user.displayName = displayName || user.displayName;
      user.updatedAt = new Date();
    } else {
      user = new User({
        firebaseUid,
        email,
        displayName,
      });
    }

    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "User details saved/updated successfully",
        user,
      });
  } catch (error) {
    console.error("Error saving user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error saving user details", error });
  }
});
// Get user profile
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update user profile
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, email, displayName, ...userData } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (user) {
      user = await User.findOneAndUpdate(
        { firebaseUid },
        {
          ...userData,
          email,
          displayName,
          updatedAt: new Date(),
        },
        { new: true }
      );
    } else {
      user = new User({
        firebaseUid,
        email,
        displayName,
        ...userData,
      });
      await user.save();
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user preferences
router.patch("/:firebaseUid/preferences", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      {
        preferences: req.body,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      firebaseUid: req.params.firebaseUid,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
