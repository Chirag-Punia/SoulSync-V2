import User from "../models/User.js";

export const loginUser = async (firebaseUid, email, displayName,photoURL) => {
  let user = await User.findOne({ firebaseUid });
  if (user) {
    user.email = email;
    user.displayName = displayName || user.displayName;
    user.updatedAt = new Date();
    user.photoURL = photoURL
  } else {
    user = new User({
      firebaseUid,
      email,
      displayName,
      photoURL,
    });
  }

  return await user.save();
};

export const getUserProfile = async (firebaseUid) => {
  const user = await User.findOne({ firebaseUid });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const createOrUpdateProfile = async (
  firebaseUid,
  email,
  displayName,
  userData
) => {
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

  return user;
};

export const updateUserPreferences = async (firebaseUid, preferences) => {
  const user = await User.findOneAndUpdate(
    { firebaseUid },
    {
      preferences,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const deleteUser = async (firebaseUid) => {
  const user = await User.findOneAndDelete({ firebaseUid });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};
