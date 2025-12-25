import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Don't connect immediately in serverless environment
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Important for serverless
    });
    
    console.log(`✅ MongoDB Connected`);
    
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