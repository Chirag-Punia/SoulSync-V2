import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["motivation", "health", "success", "happiness"],
    default: "motivation",
  },
  active: {
    type: Boolean,
    default: true,
  },
  lastSentDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Affirmation", affirmationSchema);
