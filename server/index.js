import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chat.js";
import connectDB from "./services/db.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import scheduleRoutes from "./routes/schedule.js";
import profileRoutes from "./routes/profile.js";
import { authenticateUser } from "./middleware/firebaseAuthMiddleware.js";
import fitbitRoutes from "./routes/fitBitRoutes.js";
import googleFitRoutes from "./routes/googleFitRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/chat", authenticateUser, chatRouter);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/data", authenticateUser, profileRoutes);
app.use("/api/gfit", googleFitRoutes);
app.use("/api/fitbit", fitbitRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/moods", moodRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
