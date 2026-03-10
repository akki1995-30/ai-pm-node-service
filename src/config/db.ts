import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI as string;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || "ai_pm_saas",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    } else {
      console.error("❌ Unknown error during MongoDB connection");
    }
    process.exit(1);
  }
};

export default connectDB;