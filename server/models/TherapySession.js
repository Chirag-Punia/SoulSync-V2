import mongoose from 'mongoose';

const therapySessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  hostId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 10
  },
  participants: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  }
});

export default mongoose.model('TherapySession', therapySessionSchema);