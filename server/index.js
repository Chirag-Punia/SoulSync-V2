import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat.js';
import connectDB from './services/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});