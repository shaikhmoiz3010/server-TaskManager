import express from 'express';
import authRoutes from './auth.js';
import taskRoutes from './task.js';
import notificationRoutes from './notification.js';
import testRoutes from './test.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/test', testRoutes);

export default router;