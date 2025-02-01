import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

// Index for faster queries
moodSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model("Mood", moodSchema);
