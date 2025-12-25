import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

// Load environment variables FIRST
dotenv.config();

const app = express();

// Connect to MongoDB - but handle errors gracefully
if (process.env.NODE_ENV !== 'development') {
  // In production (Vercel), we need to handle MongoDB connection differently
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('✅ MongoDB Connected to Vercel');
  }).catch(err => {
    console.error('❌ MongoDB connection error on Vercel:', err.message);
    // Don't crash the app, continue without DB (for testing)
  });
}

// CORS configuration - SIMPLIFIED for Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app', // Add your frontend URL
  ],
  credentials: true,
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Important for Vercel
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check endpoint (NO DB CHECK for now)
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working on Vercel!',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager Backend API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks'
    }
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found'
  });
});

// Vercel expects a default export
export default app;