import express from 'express';
import * as ScheduleController from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', ScheduleController.getSchedule);
router.post('/', ScheduleController.addTask);
router.put('/:taskId', ScheduleController.updateTask);
router.delete('/:taskId', ScheduleController.deleteTask);
router.patch('/task', ScheduleController.markTaskCompleted);

export default router;