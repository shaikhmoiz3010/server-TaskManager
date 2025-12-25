import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;