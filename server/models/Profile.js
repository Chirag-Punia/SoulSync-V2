import mongoose from 'mongoose';

const externSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  photoURL: { type: String },
  providerData: [{ providerId: String, uid: String, displayName: String, email: String }],
}, { timestamps: true });

const Profile = mongoose.model('Profile', externSchema);

export default Profile;
