import * as AuthService from "../services/authService.js";

export const loginUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName ,photoURL} = req.body;
    const user = await AuthService.loginUser(firebaseUid, email, displayName,photoURL);
    res.status(200).json({
      success: true,
      message: "User details saved/updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      success: false,
      message: "Error saving user details",
      error,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await AuthService.getUserProfile(req.params.firebaseUid);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
export const getUserProfile2 = async (req, res) => {
  try {
    const user = await AuthService.getUserProfile(req.user.user_id);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, ...userData } = req.body;
    const user = await AuthService.createOrUpdateProfile(
      firebaseUid,
      email,
      displayName,
      userData
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const user = await AuthService.updateUserPreferences(
      req.params.firebaseUid,
      req.body
    );
    res.json(user);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await AuthService.deleteUser(req.params.firebaseUid);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
