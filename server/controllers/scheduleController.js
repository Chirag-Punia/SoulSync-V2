import * as ScheduleService from "../services/scheduleService.js";

export const getSchedule = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const schedule = await ScheduleService.getSchedule(userId, date);
    res.json(schedule || { tasks: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { userId, task } = req.body;
    const schedule = await ScheduleService.addTask(userId, task);
    res.json(schedule);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userId, updatedTask } = req.body;
    const taskId = req.params.taskId;
    const schedule = await ScheduleService.updateTask(
      userId,
      taskId,
      updatedTask
    );
    res.json(schedule);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { userId } = req.query;
    const taskId = req.params.taskId;
    const schedule = await ScheduleService.deleteTask(userId, taskId);
    res.json(schedule);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
};

export const markTaskCompleted = async (req, res) => {
  try {
    const { userId, taskId, completed } = req.body;
    const schedule = await ScheduleService.markTaskCompleted(
      userId,
      taskId,
      completed
    );
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
