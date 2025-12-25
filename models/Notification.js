import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['task', 'system', 'reminder', 'update'],
    default: 'task'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    taskId: String,
    dueDate: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);