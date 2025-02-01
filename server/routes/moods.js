import express from 'express';
import { authenticateUser } from '../middleware/firebaseAuthMiddleware.js';
import Mood from '../models/mood.js';

const router = express.Router();

// Log new mood
router.post('/log', authenticateUser, async (req, res) => {
  try {
    const { mood, timestamp } = req.body;
    const userId = req.user.uid;

    const newMood = new Mood({
      userId,
      mood,
      timestamp,
    });

    await newMood.save();
    res.status(201).json({ message: 'Mood logged successfully' });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// Get mood history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const moodHistory = await Mood.find({ userId })
      .sort({ timestamp: -1 })
      .limit(30); // Last 30 entries

    const formattedHistory = moodHistory.map(entry => ({
      date: entry.timestamp,
      mood: entry.mood
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

export default router;