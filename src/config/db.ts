import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodb.uri)
    logger.info('✅ MongoDB connected successfully')
  } catch (error) {
    // console.error(`MongoDB connection Error: ${(error as Error).message}`)
    logger.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
};

export default connectDB
