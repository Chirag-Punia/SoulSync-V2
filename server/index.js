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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", authenticateUser, chatRouter);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/data", authenticateUser, profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
