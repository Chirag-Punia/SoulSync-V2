import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAnonymous: { type: Boolean, default: false },
  preferences: {
    notifications: { type: Boolean, default: false },
    shareData: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: true },
  },
  connectedAccounts: {
    google: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
