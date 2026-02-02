/**
 * MongoDB Connection Configuration
 * 
 * This file handles MongoDB connection and provides initialization functions.
 */

import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/social-media-app";

    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
};

export const getConnectionStatus = (): boolean => isConnected;
