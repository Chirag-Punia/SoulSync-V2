import mongoose from "mongoose";

const FitbitDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activities: {
    type: Object,
    default: null,
  },
  heartRate: {
    type: Object,
    default: null,
  },
  sleep: {
    type: Object,
    default: null,
  },
  nutrition: {
    type: Object,
    default: null,
  },
  body: {
    type: Object,
    default: null,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FitbitData", FitbitDataSchema);
