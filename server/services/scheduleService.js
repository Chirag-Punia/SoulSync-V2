import Schedule from '../models/Schedule.js';

export const getSchedule = async (userId, date) => {
  return await Schedule.findOne({ userId, date });
};

export const addTask = async (userId, task) => {
  const { date, title, description, time } = task;

  let schedule = await Schedule.findOne({ userId, date });

  if (!schedule) {
    schedule = new Schedule({ userId, date, tasks: [] });
  }

  schedule.tasks.push({ title, description, time, completed: false });
  return await schedule.save();
};

export const updateTask = async (userId, taskId, updatedTask) => {
  return await Schedule.findOneAndUpdate(
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
};

export const deleteTask = async (userId, taskId) => {
  return await Schedule.findOneAndUpdate(
    { userId },
    { $pull: { tasks: { _id: taskId } } },
    { new: true }
  );
};

export const markTaskCompleted = async (userId, taskId, completed) => {
  return await Schedule.findOneAndUpdate(
    { userId, 'tasks._id': taskId },
    { $set: { 'tasks.$.completed': completed } },
    { new: true }
  );
};