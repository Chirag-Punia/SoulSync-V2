import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Get schedule for a specific date
router.get('/', async (req, res) => {
  try {
    const { userId, date } = req.query;
    const schedule = await Schedule.findOne({ userId, date });
    res.json(schedule || { tasks: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  try {
    const { userId, task } = req.body;
    const { date, title, description, time } = task;

    let schedule = await Schedule.findOne({ userId, date });

    if (!schedule) {
      schedule = new Schedule({ userId, date, tasks: [] });
    }

    schedule.tasks.push({ title, description, time, completed: false });
    await schedule.save();

    res.json(schedule);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put('/:taskId', async (req, res) => {
  try {
    const { userId, updatedTask } = req.body;
    const taskId = req.params.taskId;

    const schedule = await Schedule.findOneAndUpdate(
      { userId, 'tasks._id': taskId },
      { 
        $set: { 
          'tasks.$.title': updatedTask.title,
          'tasks.$.description': updatedTask.description,
          'tasks.$.time': updatedTask.time,
          'tasks.$.completed': updatedTask.completed
        } 
      },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(schedule);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
  try {
    const { userId } = req.query;
    const taskId = req.params.taskId;

    const schedule = await Schedule.findOneAndUpdate(
      { userId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(schedule);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
});

// Mark task as completed
router.patch('/task', async (req, res) => {
  try {
    const { userId, taskId, completed } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { userId, 'tasks._id': taskId },
      { $set: { 'tasks.$.completed': completed } },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;