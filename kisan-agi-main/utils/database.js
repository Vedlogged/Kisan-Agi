/**
 * MongoDB Connection Utility
 * Handles connection with proper error handling for serverless environments
 */

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connects to MongoDB with retry logic and graceful error handling.
 * Safe to call multiple times - will reuse existing connection.
 */
async function connectDatabase() {
  // Reuse existing connection if available
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('📦 Reusing existing MongoDB connection.');
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const error = new Error('CRITICAL: MONGO_URI is not defined in environment variables.');
    console.error('❌', error.message);
    throw error;
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      // Recommended options for serverless environments
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ MongoDB Connected to Atlas successfully.');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected.');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    
    // In serverless, we may want to throw to prevent serving bad requests
    // rather than silently failing
    throw error;
  }
}

/**
 * Gracefully closes the MongoDB connection.
 * Useful for cleanup in tests or graceful shutdown.
 */
async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('📦 MongoDB connection closed.');
  }
}

module.exports = { connectDatabase, disconnectDatabase };
