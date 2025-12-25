import express from 'express';
import { body } from 'express-validator';
import { getTask, getTasks,createTask,updateTask,deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';


const router = express.Router();
// All routes are protected
router.use(protect);

router.get('/', getTasks);

router.get('/:id', getTask);

router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority')
], handleValidationErrors, createTask);

router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority')
], handleValidationErrors, updateTask);

router.delete('/:id', deleteTask);

export default router;