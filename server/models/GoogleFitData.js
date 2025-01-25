import mongoose from "mongoose";

const GoogleFitDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dataType: String,
  startTime: Date,
  endTime: Date,
  dataPoints: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GoogleFitData", GoogleFitDataSchema);
