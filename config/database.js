import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connection cache for serverless environments
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Return cached connection if available
    if (cachedConnection) {
      return cachedConnection;
    }

    // Don't connect immediately in serverless environment
    if (mongoose.connection.readyState >= 1) {
      cachedConnection = mongoose.connection;
      return cachedConnection;
    }

    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10, // Important for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't throw error in production, just log it
    if (process.env.NODE_ENV === 'production') {
      console.log('Continuing without MongoDB connection');
    } else {
      throw error;
    }
  }
};

export default connectDB;