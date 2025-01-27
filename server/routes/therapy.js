import express from 'express';
import { generateToken, createSession } from '../controllers/therapyController.js';
import { authenticateUser } from '../middleware/firebaseAuthMiddleware.js';

const router = express.Router();

// Generate Agora token
router.post('/token', authenticateUser, generateToken);

// Create new therapy session
router.post('/sessions', authenticateUser, createSession);

// Get all active sessions
router.get('/sessions', authenticateUser, async (req, res) => {
  try {
    const sessions = await TherapySession.find({ status: 'active' });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Join session
router.post('/sessions/:sessionId/join', authenticateUser, async (req, res) => {
  try {
    const session = await TherapySession.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({ error: 'Session is full' });
    }
    
    if (!session.participants.includes(req.user.uid)) {
      session.participants.push(req.user.uid);
      await session.save();
    }
    
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// End session
router.post('/sessions/:sessionId/end', authenticateUser, async (req, res) => {
  try {
    const session = await TherapySession.findOne({ 
      sessionId: req.params.sessionId,
      hostId: req.user.uid
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.status = 'ended';
    await session.save();
    
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to end session' });
  }
});

export default router;