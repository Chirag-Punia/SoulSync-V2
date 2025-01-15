import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat.js';
import connectDB from './services/db.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import scheduleRoutes from "./routes/schedules.js"
import externalData from "./routes/externalData.js"
import {authenticateUser} from "./middleware/firebaseAuthMiddleware.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use("/api/data",authenticateUser,externalData);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});